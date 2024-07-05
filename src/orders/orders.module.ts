import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderItem } from './orderItem.entity';
import { Order } from './order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
