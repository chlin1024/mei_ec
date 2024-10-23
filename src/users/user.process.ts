import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from 'src/mailer/mailer.service';
import { MyLogger } from 'src/utils/logger/logger';

@Processor('userVerify')
export class UserVerify {
  private readonly logger = new MyLogger(UserVerify.name);

  constructor(private mailerService: MailerService) {}

  @Process('sendUserVerify')
  async handleUserVerification(job: Job) {
    await this.mailerService.sendUserEmail(job.data);
  }

  @OnQueueFailed()
  async handleFailedJob(job: Job, error: Error) {
    this.logger.error(
      `User verification with ID ${job.id} failed. Error: ${error.message}`,
    );
  }
}
