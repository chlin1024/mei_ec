import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class LoginSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  token: string;

  @Column()
  userId: number;

  @Column()
  createdAt: Date;

  @Column()
  expiredAt: Date;

  @DeleteDateColumn()
  revokedAt: Date;
}
