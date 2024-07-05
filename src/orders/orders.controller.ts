import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDto } from './dto/order.dto';
import { InsertResult } from 'typeorm';
import { Order } from './order.entity';
import { UpdateOrderDto } from './dto/updateOrder.dto';

@Controller('guest/orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post('create')
  createOrder(@Body() orderDto: OrderDto): Promise<InsertResult> {
    return this.ordersService.createOrder(orderDto);
  }

  @Get(':id')
  getOrderById(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return this.ordersService.getOrderById(id);
  }

  @Put('update/:id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.updateOrder(id, updateOrderDto);
  }

  @Delete(':id')
  deleteOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.deleteOrderById(id);
  }
}
