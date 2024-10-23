import { Module, forwardRef } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderItem } from './entities/orderItem.entity';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { BullModule } from '@nestjs/bull';
import { OrderConfirmation } from './order.process';
import { MailerModule } from 'src/mailer/mailer.module';
import { AuthModule } from 'src/auth/auth.module';
import { OrderCreatedListener } from './order.listener';
import { ProductsModule } from 'src/products/products.module';
import { CheckoutTransaction } from './entities/checkoutTransaction.entity';
import { RefundTransaction } from './entities/refundTransaction.entity';
import { LinePayModule } from 'src/line-pay/line-pay.module';
//import { LinePayService } from 'src/line-pay/line-pay.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      CheckoutTransaction,
      RefundTransaction,
    ]),
    BullModule.registerQueue({ name: 'orderConfirmation' }),
    HttpModule,
    UsersModule,
    MailerModule,
    AuthModule,
    ProductsModule,
    forwardRef(() => LinePayModule),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderConfirmation, OrderCreatedListener],
  exports: [OrdersService],
})
export class OrdersModule {}
