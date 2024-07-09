import { LoginSession } from 'src/auth/loginSession.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserRoles } from './userRole.enum';

@Entity()
@Unique(['userName'])
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

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.GUEST,
  })
  role: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => LoginSession, (loginSession) => loginSession.user)
  loginSessions: LoginSession[];
}
