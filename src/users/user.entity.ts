import { LoginSession } from 'src/auth/loginSession.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  // extends BaseEntity
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => LoginSession, (loginSession) => loginSession.user)
  loginSessions: LoginSession[];
}
