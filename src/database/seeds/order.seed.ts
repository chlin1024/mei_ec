import { Order } from '../../orders/order.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { OrderItem } from '../../orders/orderItem.entity';

export default class OrderSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const orderFactory = await factoryManager.get(Order);
    await orderFactory.save({
      id: 1,
      guestId: 3,
    });
    const orders = await orderFactory.saveMany(9);
    for (const order of orders) {
      const orderItemFactory = await factoryManager.get(OrderItem);
      await orderItemFactory.saveMany(2, {
        orderId: order.id,
      });
    }
  }
}
