import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
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

  @OnQueueFailed()
  async handleFailedJob(job: Job, error: Error) {
    console.error(
      `Order Confirmation with ID ${job.id} failed to send. Error: ${error.message}`,
    );
  } //問題:是不是要用logger
}
