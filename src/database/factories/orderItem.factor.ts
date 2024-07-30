import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { OrderItem } from '../../orders/orderItem.entity';

export const OrderItemFactory = setSeederFactory(
  OrderItem,
  async (faker: Faker) => {
    const orderItem = new OrderItem();
    orderItem.productId = faker.number.int({ max: 26 });
    orderItem.quantity = faker.number.int({ max: 100 });
    orderItem.orderId = 0;
    return orderItem;
  },
);
