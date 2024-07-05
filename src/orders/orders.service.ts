import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderDto } from './dto/order.dto';
import { OrderItem } from './orderItem.entity';
import { UpdateOrderDto } from './dto/updateOrder.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
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
    const createOrder = {
      admin,
      guest,
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

    const updateData = {
      admin,
      guest,
      address,
      financialStatus,
      fulfillmentStatus,
      note,
    };
    console.log(updateData);
    //補 oder Item 更新
    return await this.ordersRepository.update(id, { ...updateData });
  }
}
