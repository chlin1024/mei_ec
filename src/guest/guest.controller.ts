import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwtAuthentication.guard';
import { OrderDto } from 'src/orders/dto/order.dto';
import { QueryOrderDto } from 'src/orders/dto/queryOrder.dto';
import { UpdateOrderDto } from 'src/orders/dto/updateOrder.dto';
import { Order } from 'src/orders/order.entity';
import { OrdersService } from 'src/orders/orders.service';
import { Roles } from 'src/roles.decorator';
import { RolesGuard } from 'src/roles.guard';
import { User } from 'src/users/user.entity';
import { UserRoles } from 'src/users/userRole.enum';
import { UsersService } from 'src/users/users.service';
import { InsertResult, UpdateResult } from 'typeorm';

@Roles(UserRoles.GUEST)
@UseGuards(JwtGuard, RolesGuard) // new RolesGuard()
@Controller('guests') //直接使用user service, order service或是從guest service
export class GuestController {
  constructor(
    private usersService: UsersService,
    private ordersService: OrdersService,
  ) {}

  @Get('me')
  getUserbyId(@Req() { user }): Promise<User> {
    return this.usersService.getUserById(user.id);
  }

  @Get('orders/:id')
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

  @Get('orders')
  getUser(@Query() queryOrderDto: QueryOrderDto, @Req() { user }) {
    const userId = user.id;
    return this.ordersService.getOrder(queryOrderDto, userId);
  }

  @Post('orders')
  createOrder(@Body() orderDto: OrderDto): Promise<InsertResult> {
    console.log(orderDto);
    return this.ordersService.createOrder(orderDto);
  }

  @Patch('orders/:id')
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

  @Delete('orders/:id')
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
