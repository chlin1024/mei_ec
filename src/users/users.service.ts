import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
//import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/updateUser.dto';
import * as bcrypt from 'bcrypt';

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
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const user = new User();
    user.userName = userName;
    user.password = hashPassword;
    user.name = name;
    user.email = email;
    await this.usersRepository.save(user);
    return { userName, name, email };
    //return this.userRepository.createUser(createUserDto);
  }

  async getUserById(id: number): Promise<User> {
    const result = await this.usersRepository.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException(`User ${id} Not Found`);
    }
    return result;
  }

  async getUserByUserName(userName: string): Promise<User> {
    const result = await this.usersRepository.findOne({ where: { userName } });
    if (!result) {
      throw new NotFoundException(`User ${userName} Not Found`);
    }
    return result;
  }

  async deleteUserById(id: number) {
    await this.getUserById(id);
    return await this.usersRepository.softDelete(id);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    return await this.usersRepository.update(id, { ...updateUserDto });
  }
}
