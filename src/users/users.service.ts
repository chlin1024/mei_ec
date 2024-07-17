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
//import { omit } from 'lodash';
import { QueryUsersDto } from './dto/queryUsers.dto';

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
    const { username, password, name, email } = createUserDto;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const createUserData = {
      username,
      password: hashPassword,
      name,
      email,
    };
    const userDraft = await this.usersRepository.create(createUserData);
    try {
      const newUser = await this.usersRepository.insert(userDraft);
      return newUser;
    } catch (error) {
      if (error.code === '23505') {
        //username has to be uniqe
        throw new ConflictException(error.detail);
      } else {
        throw new InternalServerErrorException(error.detail);
      }
    }
  }

  async getUsers(queryUsersDto: QueryUsersDto) {
    const { page, limit, orderBy, email, name } = queryUsersDto;
    const query = this.usersRepository.createQueryBuilder('user');
    if (name) {
      query.andWhere('user.name LIKE :name', { name: `%${name}%` });
    }
    if (email) {
      query.andWhere('user.email LIKE :email', { email: `%${email}%` });
    }
    if (orderBy) {
      const cleanOrderBy = orderBy.replace(/^'|'$/g, '');
      const orderColumn = cleanOrderBy.split(':')[0];
      const orderType = cleanOrderBy.split(':')[1].toUpperCase() as
        | 'ASC'
        | 'DESC';
      query.orderBy(orderColumn, orderType);
    }
    if (page && limit) {
      query.skip((page - 1) * limit).take(limit);
    }
    const users = await query.getMany();
    return users;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id, deletedAt: null },
    });
    if (!user) {
      throw new NotFoundException(`User ${id} Not Found`);
    }
    return user;
  }

  async getUserByUserName(username: string): Promise<User> {
    // const user = await this.usersRepository.findOne({
    //   where: { username, deletedAt: null }, });
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username = :username', { username })
      .andWhere('user.deletedAt IS NULL')
      .getOne();

    if (!user) {
      throw new NotFoundException(`User ${username} Not Found`);
    }
    return user; //omit(user, ['password']); sign in 需要
  }

  async deleteUserById(id: number) {
    await this.getUserById(id);
    return await this.usersRepository.softDelete(id);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    return await this.usersRepository.update(id, { ...updateUserDto });
  }
}
