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
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwtAuthentication.guard';
import { OrderDto } from '../orders/dto/order.dto';
import { QueryOrderDto } from '../orders/dto/queryOrder.dto';
import { UpdateOrderDto } from '../orders/dto/updateOrder.dto';
import { Order } from '../orders/entities/order.entity';
import { OrdersService } from '../orders/orders.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { User } from '../users/user.entity';
import { UserRoles } from '../users/userRole.enum';
import { UsersService } from '../users/users.service';
import { UpdateResult } from 'typeorm';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponses } from 'src/utils/decorator/api-response.decorator.';
import { createOrederResDto } from 'src/orders/dto/createOrderRes.dto';
import { MailerInterceptor } from 'src/utils/interceptor/mailer.interceptor';

@Roles(UserRoles.GUEST)
@UseGuards(JwtGuard, RolesGuard) // new RolesGuard()
@ApiTags('guests')
@ApiBearerAuth()
@ApiErrorResponses()
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
  getOrders(@Query() queryOrderDto: QueryOrderDto, @Req() { user }) {
    return this.ordersService.getOrder(queryOrderDto, user.id);
  }

  @Post('orders')
  @UseInterceptors(MailerInterceptor)
  @ApiCreatedResponse({ type: createOrederResDto })
  createOrder(
    @Body() orderDto: OrderDto,
    @Req() { user },
  ): Promise<createOrederResDto> {
    return this.ordersService.createOrder(orderDto, user.id);
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
