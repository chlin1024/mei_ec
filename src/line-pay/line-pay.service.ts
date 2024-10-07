import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
import { firstValueFrom } from 'rxjs';
dotenv.config();

@Injectable()
export class LinePayService {
  constructor(private readonly httpService: HttpService) {}

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

    // 根據不同方式(method)生成MAC
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
    console.log(reqData);

    const response = await firstValueFrom(this.httpService.request(reqData));
    //檢查return code
    const processedResponse = this.handleBigInteger(response.data);
    console.log(response);
    return processedResponse;
  }

  async checkout() {
    try {
      const data = {
        method: 'POST',
        apiPath: '/v3/payments/request',
        data: {
          amount: 100,
          currency: 'TWD',
          orderId: 'MKSI_S_20180904_1000001',
          packages: [
            {
              id: '1',
              amount: 100,
              products: [
                {
                  id: 'PEN-B-001',
                  name: 'Pen Brown',
                  imageUrl:
                    'https://pay-store.example.com/images/pen_brown.jpg',
                  quantity: 2,
                  price: 50,
                },
              ],
            },
          ],
          redirectUrls: {
            confirmUrlType: 'NONE',
            //confirmUrl: 'https://pay-store.example.com/order/payment/authorize',
            //cancelUrl: 'https://pay-store.example.com/order/payment/cancel',
          },
        },
      };
      const response = await this.requestOnlineAPI(data);
      console.log('Response: ', response);
      console.log('闊', response.info.transactionId);
      await this.startPolling(response.info.transactionId);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  private intervalId = null;
  async getPayRequestStatus(requestTransactionId) {
    try {
      console.log(requestTransactionId);
      if (!requestTransactionId) throw new Error('Transaction ID is required!');
      const response = await this.requestOnlineAPI({
        method: 'GET',
        apiPath: `/v3/payments/requests/${requestTransactionId}/check`,
      });
      switch (response.returnCode) {
        case '0000':
          console.log('In progress');
          break;
        case '0110':
          console.log('Finished');
          break;
        case '0121':
          console.log('Cancelled');
          break;

        //...

        default:
          clearInterval(this.intervalId);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async startPolling(requestTransactionId: string) {
    console.log('蒯', requestTransactionId);
    if (this.intervalId) {
      clearInterval(this.intervalId); // Clear any existing interval
    }
    this.intervalId = setInterval(
      () => this.getPayRequestStatus(requestTransactionId),
      1000,
    );
  }

  async getTransaction(id) {
    const data = {
      method: 'GET',
      apiPath: `/v3/payments/requests/${id}/check`,
      // data: {
      //   amount: 100,
      //   currency: 'TWD',
      // },
    };
    const response = await this.requestOnlineAPI(data);
    console.log('Response: ', response);
    return response;
  }
}
