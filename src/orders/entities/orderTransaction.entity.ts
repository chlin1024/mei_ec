import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Order } from './order.entity';
import { CheckoutTransaction } from './checkoutTransaction.entity';
import { RefundTransaction } from './refundTransaction.entity';

@Entity('order_transaction')
@Unique(['checkoutTransaction'])
@Unique(['refundTransaction'])
export class OrderTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_id: number;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column()
  checkout_transaction_id: number;

  @OneToOne(() => CheckoutTransaction, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'checkout_transaction_id' })
  checkoutTransaction: CheckoutTransaction;

  @Column()
  refund_transaction_id: number;

  @OneToOne(() => RefundTransaction, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'refund_transaction_id' }) // Specifies the foreign key column "refund_transaction_id"
  refundTransaction: RefundTransaction; // Nullable reference to RefundTransaction entity
}
