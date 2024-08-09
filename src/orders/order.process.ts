import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Address } from 'nodemailer/lib/mailer';
import { MailerService } from 'src/mailer/mailer.service';
import { OrderInfoDto } from './dto/order.dto';

@Processor('orderConfirmation')
export class OrderConfirmation {
  constructor(private readonly mailerService: MailerService) {}

  @Process('sendOrderConfirmation')
  async handleOrderConfirmation(job: Job) {
    const guestInfo: Address = {
      name: job.data.name,
      address: 'phoebe97p@gmail.com',
    };
    const orderInfo: OrderInfoDto = job.data.orderInfo;
    await this.mailerService.sendOrderEmail(guestInfo, orderInfo);
  }
}
