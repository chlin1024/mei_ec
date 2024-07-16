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

  async getUsers(queryUsersDto: QueryUsersDto) {
    const { page, limit, orderBy, email, name } = queryUsersDto;
    const query = this.usersRepository.createQueryBuilder('user');
    if (name) {
      query.andWhere('user.name LIKE :name', { name: `%${name}%` });
    }
    if (email) {
      query.andWhere('user.email LIKE :email', { email: `%${email}%` });
    }
    let orderColumn: string = 'id';
    let orderType: 'ASC' | 'DESC' = 'DESC';
    if (orderBy) {
      const cleanOrderBy = orderBy.replace(/^'|'$/g, '');
      orderColumn = cleanOrderBy.split(':')[0];
      orderType = cleanOrderBy.split(':')[1].toUpperCase() as 'ASC' | 'DESC';
    }
    //const order: Record<string, 'ASC' | 'DESC'> = { [orderColumn]: orderType };

    const users = await query
      .orderBy(orderColumn, orderType)
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
    const results = users.map((user) => omit(user, 'password'));
    return results;
  }
  //page=1&limit=10&orderBy='createdAt:desc'&name=someone

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
    const user = await this.usersRepository.findOne({
      where: { userName, deletedAt: null },
    });
    if (!user) {
      throw new NotFoundException(`User ${userName} Not Found`);
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
