import { User } from '../../users/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from '../entities/orderItem.entity';
import { FinancialStatus, FulfillmentStatus } from '../orderStatus.enum';
import { CheckoutTransaction } from './checkoutTransaction.entity';
import { RefundTransaction } from './refundTransaction.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  adminId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'adminId' })
  admin: User;

  @Column()
  guestId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'guestId' })
  guest: User;

  @Column()
  address: string;

  @Column({
    type: 'enum',
    enum: FinancialStatus,
    default: FinancialStatus.PENDING,
  })
  financialStatus: string; // padding, paid, refund

  @Column({
    type: 'enum',
    enum: FulfillmentStatus,
    default: FulfillmentStatus.PENDING,
  })
  fulfillmentStatus: string;

  @Column({ nullable: true })
  note: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems: OrderItem[];

  @OneToOne(
    () => CheckoutTransaction,
    (checkoutTransaction) => checkoutTransaction.order,
  )
  checkoutTransaction: CheckoutTransaction;

  @OneToOne(
    () => RefundTransaction,
    (refundTransaction) => refundTransaction.order,
  )
  refundTransaction: RefundTransaction;
}
