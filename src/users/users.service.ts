import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
//import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  // constructor(
  //   @InjectRepository(UserRepository)
  //   private userRepository: UserRepository,
  // ) {}
  async createUser(createUserDto: CreateUserDto) {
    const { userName, password, name, email } = createUserDto;
    const user = new User();
    user.userName = userName;
    user.password = password;
    user.name = name;
    user.email = email;
    await this.usersRepository.save(user);
    return user;
    //return this.userRepository.createUser(createUserDto);
  }
}
