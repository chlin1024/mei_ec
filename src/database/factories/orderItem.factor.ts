import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { OrderItem } from '../../orders/entities/orderItem.entity';

export const OrderItemFactory = setSeederFactory(
  OrderItem,
  async (faker: Faker) => {
    const orderItem = new OrderItem();
    orderItem.productId = faker.number.int({ min: 1, max: 10 });
    orderItem.quantity = faker.number.int({ max: 100 });
    orderItem.orderId = 0;
    return orderItem;
  },
);
