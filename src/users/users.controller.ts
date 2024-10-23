import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './user.entity';
import { UpdateResult } from 'typeorm';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  getUser(@Param('id') id: number): Promise<User> {
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
