import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderDto } from './dto/order.dto';
import { OrderItem } from './orderItem.entity';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { UsersService } from 'src/users/users.service';
import { QueryOrderDto } from './dto/queryOrder.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private userService: UsersService,
  ) {}

  async createOrder(orderDto: OrderDto) {
    const {
      admin,
      guest,
      address,
      financialStatus,
      fulfillmentStatus,
      note,
      orderItems,
    } = orderDto;
    let adminInfo, guestInfo;
    if (admin) {
      adminInfo = await this.userService.getUserById(admin);
    }
    if (guest) {
      guestInfo = await this.userService.getUserById(guest);
    }

    const createOrder = {
      admin: adminInfo,
      guest: guestInfo,
      address,
      financialStatus,
      fulfillmentStatus,
      note,
      createAt: new Date(),
    };
    const orderDraft = await this.ordersRepository.create(createOrder);
    const newOrder = await this.ordersRepository.insert(orderDraft);
    const newOrderId = newOrder.identifiers[0].id;
    const orderItemsObj = JSON.parse(orderItems);

    for (const item of orderItemsObj) {
      const createOrderItem = { ...item, order: newOrderId };
      const orderitemDraft =
        await this.orderItemsRepository.create(createOrderItem);
      await this.orderItemsRepository.insert(orderitemDraft);
    }

    return newOrder;
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
    const { admin, guest, address, financialStatus, fulfillmentStatus, note } =
      updateOrderDto;
    let adminInfo, guestInfo;
    if (admin) {
      adminInfo = await this.userService.getUserById(admin);
    }
    if (guest) {
      guestInfo = await this.userService.getUserById(guest);
    }

    console.log(adminInfo);
    const updateData = {
      admin: adminInfo,
      guest: guestInfo,
      address,
      financialStatus,
      fulfillmentStatus,
      note,
    };
    console.log(updateData);
    //補 oder Item 更新
    return await this.ordersRepository.update(id, { ...updateData });
  }

  async getOrderByUserId(id: number) {
    const query = this.ordersRepository.createQueryBuilder('order');
    const order = await query
      .andWhere('order.guest = :guest', { guest: id })
      .andWhere('order.deletedAt IS NULL')
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      // .skip((page - 1) * limit)
      // .take(limit)
      .getMany();
    if (!order) {
      throw new NotFoundException(`User ${id} Order not found`);
    }
    return order;
  }

  async getOrder(queryOrderDto: QueryOrderDto, userId: number) {
    console.log(userId);
    console.log(queryOrderDto);
    const {
      address,
      financialStatus,
      fulfillmentStatus,
      page,
      limit,
      orderBy,
    } = queryOrderDto;
    const query = this.ordersRepository.createQueryBuilder('order');
    console.log(address);
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
    let orderColumn = 'id';
    let orderType: 'ASC' | 'DESC' = 'DESC';
    if (orderBy) {
      const cleanOrderBy = orderBy.replace(/^'|'$/g, '');
      orderColumn = cleanOrderBy.split(':')[0];
      orderType = cleanOrderBy.split(':')[1].toUpperCase() as 'ASC' | 'DESC';
    }
    console.log(orderColumn, orderType);
    const results = await query
      .orderBy(`order.${orderColumn}`, orderType)
      .andWhere('order.guest = :guest', { guest: userId })
      .andWhere('order.deletedAt IS NULL')
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
    console.log(results);
    return results;
  }
}
