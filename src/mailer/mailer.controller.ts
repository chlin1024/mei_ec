import { Body, Controller, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { Address } from 'nodemailer/lib/mailer';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('/verifyEmail')
  async sendVerifyEmail(@Body() userInfo: Address) {
    return await this.mailerService.sendEmail(userInfo);
  }
}
