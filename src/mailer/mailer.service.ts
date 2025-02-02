import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail, { Address } from 'nodemailer/lib/mailer';
import * as dotenv from 'dotenv';
import { OrderInfoDto } from 'src/orders/dto/order.dto';
import { CreateUserResDto } from 'src/users/dto/createUserRes.dto';
import { MyLogger } from 'src/utils/logger/logger';
dotenv.config();

@Injectable()
export class MailerService {
  private readonly logger = new MyLogger(MailerService.name);
  mailTransport() {
    const transporter = nodemailer.createTransport({
      //因為是用
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
    return transporter;
  }

  async sendOrderEmail(guestInfo: Address, orderInfo: OrderInfoDto) {
    const {
      guestId,
      address,
      financialStatus,
      fulfillmentStatus,
      orderItems,
      orderId,
    } = orderInfo;
    let note = orderInfo.note;
    if (!note) {
      note = '';
    }
    const transport = this.mailTransport();
    const mailOptions: Mail.Options = {
      from: 'mei.ec.verify@gmail.com',
      //要傳送的對象
      to: guestInfo.address,
      //信件主旨
      subject: `Mei EC 訂單通知${guestInfo.name} 的訂單-${orderId}`,
      html: `<h1>訂單通知</h1>
      <p>親愛的${guestInfo.name}您好，<br>歡迎您使用mei的服務。</p>
      <p><strong>訂單資訊：</strong></p>
      <p>Guest ID: ${guestId}</p>
      <p>訂單編號: ${orderId}</p>
      <p>寄送地址: ${address}</p>
      <p>訂單明細:
      <ul>
      ${orderItems
        .map(
          (item) => `
        <li>
          產品: ${item.productId}, 數量: ${item.quantity}
        </li>`,
        )
        .join('')}
      </ul>
      </p>
      <p>付款狀態: ${financialStatus}</p>
      <p>訂單狀態: ${fulfillmentStatus}</p>
      <p>備註: ${note}</p>
      `,
    };
    try {
      const result = await transport.sendMail(mailOptions);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to send verification email to ${guestInfo.address}. Error: ${error.message}`,
        error,
      );
    }
  }

  async sendUserEmail(guestInfo: CreateUserResDto) {
    const transport = this.mailTransport();
    const mailOptions: Mail.Options = {
      from: 'mei.ec.verify@gmail.com',
      //要傳送的對象
      to: guestInfo.address,
      //信件主旨
      subject: `Mei EC 會員確認信`,
      html: `<h1>會員確認</h1>
      <p>親愛的${guestInfo.name}您好，<br>歡迎您使用mei的服務。</p>
      <p>會員編號:${guestInfo.userId}</p>`,
    };
    try {
      const result = await transport.sendMail(mailOptions);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to send verification email to ${guestInfo.address}. Error: ${error.message}`,
        error,
      );
    }
  }
}
