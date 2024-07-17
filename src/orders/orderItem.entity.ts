import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/products/product.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.orderItems) //typeORM的設定問題，為什麼樣設定在資料庫column名稱會是orderId
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  productId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  quantity: number;

  @DeleteDateColumn()
  deletedAt: Date;
}
