import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './user.entity';
import { InsertResult, UpdateResult } from 'typeorm';
import { UpdateUserDto } from './dto/updateUser.dto';
import { QueryUsersDto } from './dto/queryUsers.dto';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRoles } from './userRole.enum';
import { JwtGuard } from '../auth/guard/jwtAuthentication.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  @Roles(UserRoles.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  getUser(@Query() queryUsersDto: QueryUsersDto): Promise<User[]> {
    return this.usersService.getUsers(queryUsersDto);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<InsertResult> {
    return this.usersService.createUser(createUserDto);
  }

  @Delete()
  @Roles(UserRoles.GUEST)
  @UseGuards(JwtGuard, RolesGuard)
  deleteUserById(@Req() { user }): Promise<UpdateResult> {
    return this.usersService.deleteUserById(user.id);
  }

  @Patch()
  @Roles(UserRoles.GUEST)
  @UseGuards(JwtGuard, RolesGuard)
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() { user },
  ): Promise<UpdateResult> {
    return this.usersService.updateUser(user.id, updateUserDto);
  }
}
