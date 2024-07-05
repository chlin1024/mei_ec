import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDto } from './dto/order.dto';

@Controller('guest/orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}
  @Post('create')
  createUser(@Body() orderDto: OrderDto): object {
    return this.ordersService.createOrder(orderDto);
  }
}
