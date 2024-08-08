import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail, { Address } from 'nodemailer/lib/mailer';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class MailerService {
  mailTransport() {
    const transporter = nodemailer.createTransport({
      //因為是用
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'mei.ec.verify@gmail.com',
        pass: process.env.EMAIL_PASS,
        // type: 'OAuth2',
        // user: '你用來申請的gmail',
        // clientId: '申請的OAuth client_Id',
        // clientSecret: '申請的OAuth client_Id',
        // refreshToken: '你換到的refresh token',
        // accessToken: '你換到的 access token',
      },
    });
    return transporter;
  }

  async sendEmail(userInfo: Address) {
    const transport = this.mailTransport();
    const mailOptions: Mail.Options = {
      from: 'mei.ec.verify@gmail.com',
      //要傳送的對象
      to: userInfo.address,
      //信件主旨
      subject: 'Mei EC 會員註冊通知',
      html: '<h1>謝謝您註冊為Mei會員</h1><p>親愛的會員您好，<br>歡迎您使用mei的服務。</p>',
      //夾帶檔案,
    };
    try {
      const result = await transport.sendMail(mailOptions);
      return result;
    } catch (error) {
      error;
    }
  }
}
