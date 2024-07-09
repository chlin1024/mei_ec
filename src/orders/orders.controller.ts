import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDto } from './dto/order.dto';
import { InsertResult, UpdateResult } from 'typeorm';
import { Order } from './order.entity';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { UserRoles } from 'src/users/userRole.enum';
import { Roles } from 'src/roles.decorator';
import { JwtGuard } from 'src/auth/guard/jwtAuthentication.guard';
import { RolesGuard } from 'src/roles.guard';

@Controller('guest/orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @Roles(UserRoles.GUEST)
  @UseGuards(JwtGuard, RolesGuard)
  createOrder(@Body() orderDto: OrderDto): Promise<InsertResult> {
    return this.ordersService.createOrder(orderDto);
  }

  @Get(':id')
  @Roles(UserRoles.GUEST)
  @UseGuards(JwtGuard, RolesGuard)
  async getOrderById(
    @Param('id', ParseIntPipe) id: number,
    @Req() { user },
  ): Promise<Order> {
    const order = await this.ordersService.getOrderById(id);
    const orderGuestId = order.guest.id;
    if (orderGuestId !== user.id) {
      throw new UnauthorizedException('User ID does not match');
    }
    return order;
  }

  @Get('user/:id')
  @Roles(UserRoles.GUEST)
  @UseGuards(JwtGuard, RolesGuard)
  getOrderByUserId(
    @Param('id', ParseIntPipe) id: number,
    @Req() { user },
  ): Promise<Order[]> {
    if (user.id !== id) {
      throw new UnauthorizedException('User ID does not match');
    }
    return this.ordersService.getOrderByUserId(id);
  }

  @Put('update/:id')
  @Roles(UserRoles.GUEST)
  @UseGuards(JwtGuard, RolesGuard)
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() { user },
  ): Promise<UpdateResult> {
    const order = await this.ordersService.getOrderById(id);
    const orderGuestId = order.guest.id;
    if (orderGuestId !== user.id) {
      throw new UnauthorizedException('User ID does not match');
    }
    return this.ordersService.updateOrder(id, updateOrderDto);
  }

  @Delete(':id')
  @Roles(UserRoles.GUEST)
  @UseGuards(JwtGuard, RolesGuard)
  async deleteOrderById(
    @Param('id', ParseIntPipe) id: number,
    @Req() { user },
  ): Promise<UpdateResult> {
    const order = await this.ordersService.getOrderById(id);
    const orderGuestId = order.guest.id;
    if (orderGuestId !== user.id) {
      throw new UnauthorizedException('User ID does not match');
    }
    return this.ordersService.deleteOrderById(id);
  }
}
