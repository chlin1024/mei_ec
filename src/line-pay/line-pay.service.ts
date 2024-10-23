import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
import { firstValueFrom } from 'rxjs';
import { CheckoutTransaction } from 'src/orders/entities/checkoutTransaction.entity';
import { Order } from 'src/orders/entities/order.entity';
import { OrderTransaction } from 'src/orders/entities/orderTransaction.entity';
import { FinancialStatus } from 'src/orders/orderStatus.enum';
import { OrdersService } from 'src/orders/orders.service';
import { DataSource } from 'typeorm';
dotenv.config();

@Injectable()
export class LinePayService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => OrdersService))
    private orderService: OrdersService,
    private dataSource: DataSource,
  ) {}

  private signKey(clientKey: string, msg: string): string {
    const encoder = new TextEncoder();
    return crypto
      .createHmac('sha256', encoder.encode(clientKey))
      .update(encoder.encode(msg))
      .digest('base64');
  }

  private handleBigInteger(text) {
    if (typeof text !== 'string') {
      text = JSON.stringify(text); // Convert the input to a string if it is an object
    }
    const largeNumberRegex = /:\s*(\d{16,})\b/g;
    const processedText = text.replace(largeNumberRegex, ': "$1"');
    const data = JSON.parse(processedText);
    return data;
  }

  private async requestOnlineAPI({
    method,
    baseUrl = 'https://sandbox-api-pay.line.me',
    apiPath,
    queryString = '',
    data = null,
  }) {
    const channelSecret = process.env.LINE_PAY_CHANNEL_SECRET;
    const channelId = parseInt(process.env.LINE_PAY_CHANNEL_ID);
    const nonce = crypto.randomUUID();
    let signature = '';

    if (method === 'GET') {
      signature = this.signKey(
        channelSecret,
        channelSecret + apiPath + queryString + nonce,
      );
    } else if (method === 'POST') {
      signature = this.signKey(
        channelSecret,
        channelSecret + apiPath + JSON.stringify(data) + nonce,
      );
    }
    const headers = {
      'X-LINE-ChannelId': channelId,
      'X-LINE-Authorization': signature,
      'X-LINE-Authorization-Nonce': nonce,
      'X-LINE-ChannelSecret': channelSecret,
    };
    const reqData = {
      method: method,
      url: `${baseUrl}${apiPath}${queryString !== '' ? '&' + queryString : ''}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      data: data ? JSON.stringify(data) : null,
    };
    const response = await firstValueFrom(this.httpService.request(reqData));
    return this.handleBigInteger(response.data);
  }

  async checkout(linepayData) {
    try {
      const data = {
        method: 'POST',
        apiPath: '/v3/payments/request',
        data: {
          amount: linepayData.amount,
          currency: 'TWD',
          orderId: linepayData.orderId,
          packages: linepayData.packages,
          redirectUrls: {
            confirmUrl: `${process.env.NGROK_HTTPS}/line-pay/confirm`,
            //cancelUrl: 'https://pay-store.example.com/order/payment/cancel',
          },
        },
      };
      return await this.requestOnlineAPI(data);
    } catch (error) {
      console.log(error);
    }
  }

  async confirm(transactionId: string, orderId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const order = await this.orderService.getOrderById(orderId);
      let amount: number = 0;
      for (const item of order.orderItems) {
        amount += item.selling_price * item.quantity;
      }

      await this.requestOnlineAPI({
        method: 'POST',
        apiPath: `/v3/payments/${transactionId}/confirm`,
        data: {
          amount,
          currency: 'TWD',
        },
      });
      const createCheckout = {
        order_id: orderId,
        amount,
      };
      const checkoutDraft = queryRunner.manager.create(
        CheckoutTransaction,
        createCheckout,
      );
      const newCheckout = await queryRunner.manager.save(
        CheckoutTransaction,
        checkoutDraft,
      );

      const saveTransaction = {
        order_id: orderId,
        checkout_transaction_id: newCheckout.id,
      };
      const draft = queryRunner.manager.create(
        OrderTransaction,
        saveTransaction,
      );
      await queryRunner.manager.save(OrderTransaction, draft);

      await queryRunner.manager.update(Order, orderId, {
        financialStatus: FinancialStatus.PAID,
      });
      await queryRunner.commitTransaction();
      return newCheckout;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async refund(transactionId: string) {
    try {
      const refundResponse = await this.requestOnlineAPI({
        method: 'POST',
        apiPath: `/v3/payments/${transactionId}/refund`,
      });

      console.log('Refund response: ', refundResponse);
    } catch (error) {
      console.log(error);
    }
  }
}
