import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
//import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/updateUser.dto';

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

  async getUserById(id: number): Promise<User> {
    const result = await this.usersRepository.findOne({ where: { id } });
    return result;
  }

  async deleteUserById(id: number) {
    const result = await this.usersRepository.softDelete(id);
    return result;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    // const { userName, password, name, email } = updateUserDto;
    // const user = new User();
    // user.userName = userName;
    // user.password = password;
    // user.name = name;
    // user.email = email;
    return await this.usersRepository.update(id, { ...updateUserDto });
    //return this.userRepository.createUser(createUserDto);
  }
}
