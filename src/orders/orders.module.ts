import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderItem } from './orderItem.entity';
import { Order } from './order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { BullModule } from '@nestjs/bull';
import { OrderConfirmation } from './order.process';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    BullModule.registerQueue({ name: 'orderConfirmation' }),
    UsersModule,
    MailerModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderConfirmation],
  exports: [OrdersService],
})
export class OrdersModule {}
