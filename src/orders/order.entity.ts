import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'admin' })
  admin: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'guest' })
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
  fulfillmentStatus: string; // padding, fulfilled, sale_return

  @Column({ nullable: true })
  note: string;

  @CreateDateColumn() // TODO: created, update, delete 這三個時間大多由 DB 產生
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems: OrderItem[];
}
