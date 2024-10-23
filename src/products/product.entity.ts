import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  // extends BaseEntity
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  sale_price: number;

  @Column()
  description: string;

  @Column()
  inStock: number;

  @DeleteDateColumn()
  deletedAt: Date;
}
