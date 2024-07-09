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
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './user.entity';
import { UpdateResult } from 'typeorm';
import { UpdateUserDto } from './dto/updateUser.dto';
import { QueryUsersDto } from './dto/queryUsers.dto';
import { RolesGuard } from 'src/roles.guard';
import { Roles } from 'src/roles.decorator';
import { UserRoles } from './userRole.enum';
import { JwtGuard } from 'src/auth/guard/jwtAuthentication.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  getUser(@Query() queryUsersDto: QueryUsersDto) {
    return this.usersService.getUsers(queryUsersDto);
  }
  //page=1&limit=10&orderBy='createdAt:desc'&name=someone

  @Get(':id')
  @UseGuards(JwtGuard, RolesGuard) // new RolesGuard()
  @Roles(UserRoles.GUEST)
  getUserbyId(@Param('id') id: number, @Req() { user }): Promise<User> {
    console.log(user);
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
