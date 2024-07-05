import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderDto } from './dto/order.dto';
import { OrderItem } from './orderItem.entity';

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
    console.log(orderItems);
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
}
