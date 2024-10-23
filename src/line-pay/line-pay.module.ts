import { Module, forwardRef } from '@nestjs/common';
import { LinePayService } from './line-pay.service';
import { HttpModule } from '@nestjs/axios';
import { LinePayController } from './line-pay.controller';
//import { OrdersService } from 'src/orders/orders.service';
import { OrdersModule } from 'src/orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { OrderItem } from 'src/orders/entities/orderItem.entity';
import { CheckoutTransaction } from 'src/orders/entities/checkoutTransaction.entity';
import { RefundTransaction } from 'src/orders/entities/refundTransaction.entity';
import { UsersModule } from 'src/users/users.module';
//import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => OrdersModule),
    UsersModule,
    //ProductsModule,
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      CheckoutTransaction,
      RefundTransaction,
    ]),
  ],
  providers: [LinePayService],
  controllers: [LinePayController],
  exports: [LinePayService],
})
export class LinePayModule {}
