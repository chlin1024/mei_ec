import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UpdateResult } from 'typeorm';
import { Order } from './order.entity';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { UserRoles } from '../users/userRole.enum';
import { Roles } from '../auth/roles.decorator';
import { JwtGuard } from '../auth/guard/jwtAuthentication.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { QueryOrderDto } from './dto/queryOrder.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponses } from 'src/utils/decorator/api-response.decorator.';

@ApiTags('orders')
@ApiErrorResponses()
@ApiBearerAuth()
@Controller('orders')
@Roles(UserRoles.ADMIN)
@UseGuards(JwtGuard, RolesGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get(':id')
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

  @Patch(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<UpdateResult> {
    return this.ordersService.updateOrder(id, updateOrderDto);
  }

  @Delete(':id')
  async deleteOrderById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UpdateResult> {
    return this.ordersService.deleteOrderById(id);
  }

  @Get()
  getUser(@Query() queryOrderDto: QueryOrderDto, @Req() { user }) {
    const userId = user.id;
    return this.ordersService.getOrder(queryOrderDto, userId);
  }
}
