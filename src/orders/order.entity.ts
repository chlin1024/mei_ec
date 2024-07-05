import { User } from 'src/users/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './orderItem.entity';
import { FinancialStatus, FulfillmentStatus } from './orderStatus.enum';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  s;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'admin' })
  admin: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'guest' })
  guest: number;

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
  fulfillmentStatus: string; // padding, fulfilled, sale_return

  @Column({ nullable: true })
  note: string;

  @Column()
  createAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];
}
