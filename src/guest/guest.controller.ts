import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwtAuthentication.guard';
import { QueryOrderDto } from 'src/orders/dto/queryOrder.dto';
import { Order } from 'src/orders/order.entity';
import { OrdersService } from 'src/orders/orders.service';
import { Roles } from 'src/roles.decorator';
import { RolesGuard } from 'src/roles.guard';
import { User } from 'src/users/user.entity';
import { UserRoles } from 'src/users/userRole.enum';
import { UsersService } from 'src/users/users.service';

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
}
