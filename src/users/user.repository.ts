import { Repository } from 'typeorm';
import { User } from './user.entity';
//import { CreateUserDto } from './dto/createUser.dto';

export class UserRepository extends Repository<User> {
  // async createUser(createUserDto: CreateUserDto): Promise<User> {
  //   const { userName, password, name, email } = createUserDto;
  //   const user = new User();
  //   user.userName = userName;
  //   user.password = password;
  //   user.name = name;
  //   user.email = email;
  //   await user.save();
  //   return user;
  // }
}
