import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderDto } from './dto/order.dto';
import { OrderItem } from './orderItem.entity';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { UsersService } from '../users/users.service';
import { QueryOrderDto } from './dto/queryOrder.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class OrdersService {
  constructor(
    @InjectQueue('orderConfirmation')
    private orderConfirmation: Queue,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private userService: UsersService,
  ) {}

  async findRole(id: number) {
    const user = await this.userService.getUserById(id);
    if (user.role === 'admin') {
      return 'admin';
    }
    if (user.role === 'guest') {
      return 'guest';
    }
  }

  async createOrder(orderDto: OrderDto, userId: number) {
    const { adminId, address, note, orderItems } = orderDto;
    const admin = await this.findRole(adminId);
    const guest = await this.findRole(userId);

    if (admin !== 'admin') {
      throw new UnauthorizedException(); //Q:用什麼exception比較好
    }

    if (guest !== 'guest') {
      throw new UnauthorizedException();
    }
    const createOrder = {
      adminId,
      guestId: userId,
      address,
      note,
    };
    const orderDraft = await this.ordersRepository.create(createOrder);
    const result = await this.ordersRepository.insert(orderDraft);
    const newOrder = result.generatedMaps[0];
    // Q: 需不需要做如果被成功整個rollback?
    for (const item of orderItems) {
      const createOrderItem = { ...item, orderId: newOrder.id };
      const orderitemDraft = this.orderItemsRepository.create(createOrderItem);
      await this.orderItemsRepository.insert(orderitemDraft);
    }
    const user = await this.userService.getUserById(userId);
    await this.orderConfirmation.add(
      'sendOrderConfirmation',
      {
        guestInfo: {
          name: user.name,
          address: user.email,
        },
        orderInfo: {
          ...orderDto,
          guestId: userId,
          orderId: newOrder.id,
          financialStatus: newOrder.financialStatus,
          fulfillmentStatus: newOrder.fulfillmentStatus,
        },
      },
      { attempts: 3 },
    );
    return result;
  }

  async getOrderById(id: number) {
    const query = this.ordersRepository.createQueryBuilder('order');
    const order = await query
      .andWhere('order.id = :id', { id })
      .andWhere('order.deletedAt IS NULL')
      .leftJoinAndSelect('order.admin', 'admin')
      .leftJoinAndSelect('order.guest', 'guest') //如何只顯示user id，現在user連password都return
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .getOne();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async deleteOrderById(id: number) {
    await this.orderItemsRepository.softDelete({ order: { id } });
    return await this.ordersRepository.softDelete(id);
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto) {
    const {
      adminId,
      guestId,
      address,
      financialStatus,
      fulfillmentStatus,
      note,
      orderItems,
    } = updateOrderDto;

    const updateOrderData = {
      adminId,
      guestId,
      address,
      financialStatus,
      fulfillmentStatus,
      note,
    };
    if (adminId) {
      const admin = await this.findRole(adminId);
      if (admin !== 'admin') {
        throw new UnauthorizedException(); //Q:用什麼exception比較好
      }
    }
    if (guestId) {
      const guest = await this.findRole(guestId);

      if (guest !== 'guest') {
        throw new UnauthorizedException();
      }
    }
    if (orderItems) {
      for (const item of orderItems) {
        await this.orderItemsRepository.update(
          { order: { id: id }, product: { id: item.productId } },
          { quantity: item.quantity },
        );
      }
    }
    function needUpdate(updateOrderData) {
      for (const key in updateOrderData) {
        if (updateOrderData[key] !== undefined) {
          return true;
        }
      }
      return false;
    }
    const orderNeedUpdate = needUpdate(updateOrderData);

    let result;
    if (orderNeedUpdate) {
      result = await this.ordersRepository.update(id, {
        ...updateOrderData,
      });
    }
    return result;
  }

  // async getOrderByUserId(id: number) {
  //   const query = this.ordersRepository.createQueryBuilder('order');
  //   const order = await query
  //     .andWhere('order.guest = :guest', { guest: id })
  //     .andWhere('order.deletedAt IS NULL')
  //     .leftJoinAndSelect('order.orderItems', 'orderItem')
  //     .getMany();
  //   if (!order) {
  //     throw new NotFoundException(`User ${id} Order not found`);
  //   }
  //   return order;
  // }

  async getOrder(queryOrderDto: QueryOrderDto, userId: number) {
    const {
      address,
      financialStatus,
      fulfillmentStatus,
      orderBy,
      page,
      limit,
    } = queryOrderDto;
    const query = this.ordersRepository.createQueryBuilder('order');
    if (address) {
      query.andWhere('order.address LIKE :address', {
        address: `%${address}%`,
      });
    }
    if (financialStatus) {
      query.andWhere('order.financialStatus = :financialStatus', {
        financialStatus,
      });
    }
    if (fulfillmentStatus) {
      query.andWhere('order.fulfillmentStatus = :fulfillmentStatus', {
        fulfillmentStatus,
      });
    }

    if (orderBy) {
      const cleanOrderBy = orderBy.replace(/^'|'$/g, '');
      const orderColumn = cleanOrderBy.split(':')[0];
      const orderType = cleanOrderBy.split(':')[1].toUpperCase() as
        | 'ASC'
        | 'DESC';
      query.orderBy(`order.${orderColumn}`, orderType);
    }
    if (page && limit) {
      query.skip((page - 1) * limit).take(limit);
    }

    const results = await query
      .andWhere('order.guest = :guest', { guest: userId })
      .andWhere('order.deletedAt IS NULL')
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .getMany();
    return results;
  }
}
