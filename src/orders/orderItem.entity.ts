import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/products/product.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.orderItems) //typeORM的設定問題，為什麼樣設定在資料庫column名稱會是orderId
  order: Order;

  @ManyToOne(() => Product)
  product: Product;

  @Column()
  quantity: number;
}
