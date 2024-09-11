import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('checkout_transaction')
export class CheckoutTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  checkedoutAt: Date;

  @Column()
  order_id: number;

  @OneToOne(() => Order, (order) => order.checkoutTransaction, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
