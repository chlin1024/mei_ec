import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { BullModule } from '@nestjs/bull';
import { UserVerify } from './user.process';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    BullModule.registerQueue({ name: 'userVerify' }),
    MailerModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserVerify],
  exports: [UsersService],
})
export class UsersModule {}
