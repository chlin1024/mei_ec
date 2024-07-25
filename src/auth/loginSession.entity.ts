import { User } from '../users/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
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

  @ManyToOne(() => User, (user) => user.loginSessions)
  user: User;
}
