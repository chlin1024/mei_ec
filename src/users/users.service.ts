import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
//import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/updateUser.dto';
import * as bcrypt from 'bcrypt';
import { omit } from 'lodash';

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
    try {
      await this.usersRepository.save(user);
      return { userName, name, email };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(error.detail);
      } else {
        throw new InternalServerErrorException(error.detail);
      }
    }

    //return this.userRepository.createUser(createUserDto);
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id, deletedAt: null },
    });
    if (!user) {
      throw new NotFoundException(`User ${id} Not Found`);
    }
    return omit(user, ['password']);
  }

  async getUserByUserName(userName: string): Promise<User> {
    const result = await this.usersRepository.findOne({
      where: { userName, deletedAt: null },
    });
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
