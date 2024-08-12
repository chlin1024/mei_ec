import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from 'src/mailer/mailer.service';

@Processor('orderConfirmation')
export class OrderConfirmation {
  constructor(private readonly mailerService: MailerService) {}

  @Process('sendOrderConfirmation')
  async handleOrderConfirmation(job: Job) {
    await this.mailerService.sendOrderEmail(
      job.data.guestInfo,
      job.data.orderInfo,
    );
  }
}
