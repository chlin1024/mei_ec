import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './user.entity';
import { UpdateResult } from 'typeorm';
import { UpdateUserDto } from './dto/updateUser.dto';
import { QueryUsersDto } from './dto/queryUsers.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  getUser(@Query() queryUsersDto: QueryUsersDto) {
    console.log(queryUsersDto);
    return this.usersService.getUsers(queryUsersDto);
  }
  //page=1&limit=10&orderBy='createdAt:desc'&name=someone

  @Get(':id')
  getUserbyId(@Param('id') id: number): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Post('signup')
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto): object {
    return this.usersService.createUser(createUserDto);
  }

  @Delete(':id')
  deleteUserById(@Param('id', ParseIntPipe) id: number): Promise<UpdateResult> {
    return this.usersService.deleteUserById(id);
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return this.usersService.updateUser(id, updateUserDto);
  }
}
