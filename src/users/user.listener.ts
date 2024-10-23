import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bull';

@Injectable()
export class UserRegisteredListener {
  constructor(
    @InjectQueue('userVerify')
    private userVerify: Queue,
  ) {}

  @OnEvent('user.registered')
  async handleUserRegisteredEvent(userData: any) {
    await this.userVerify.add('sendUserVerify', userData, { attempts: 3 });
  }
}
