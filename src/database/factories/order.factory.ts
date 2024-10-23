import { Faker } from '@faker-js/faker';
import { Order } from '../../orders/entities/order.entity';
import { setSeederFactory } from 'typeorm-extension';
import {
  FinancialStatus,
  FulfillmentStatus,
} from '../../orders/orderStatus.enum';

export const OrderFactory = setSeederFactory(Order, async (faker: Faker) => {
  const order = new Order();
  order.adminId = 1;
  order.guestId = faker.number.int({ min: 2, max: 15 });
  order.address = faker.location.streetAddress();
  order.financialStatus = faker.helpers.enumValue(FinancialStatus);
  order.fulfillmentStatus = faker.helpers.enumValue(FulfillmentStatus);
  order.note = faker.lorem.lines(2);
  return order;
});
