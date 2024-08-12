import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from 'src/mailer/mailer.service';

@Processor('userVerify')
export class UserVerify {
  constructor(private mailerService: MailerService) {}

  @Process('sendUserVerify')
  async handleUserVerification(job: Job) {
    await this.mailerService.sendUserEmail(job.data);
  }
}
