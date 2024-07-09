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
  UnauthorizedException,
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
  @Roles(UserRoles.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  getUser(@Query() queryUsersDto: QueryUsersDto) {
    return this.usersService.getUsers(queryUsersDto);
  }

  @Get(':id')
  @Roles(UserRoles.GUEST)
  @UseGuards(JwtGuard, RolesGuard) // new RolesGuard()
  getUserbyId(@Param('id') id: number, @Req() { user }): Promise<User> {
    if (user.id !== id) {
      throw new UnauthorizedException('User ID does not match');
    }
    return this.usersService.getUserById(id);
  }

  @Post('signup')
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto): object {
    return this.usersService.createUser(createUserDto);
  }

  @Delete(':id')
  @Roles(UserRoles.GUEST)
  @UseGuards(JwtGuard, RolesGuard)
  deleteUserById(
    @Param('id', ParseIntPipe) id: number,
    @Req() { user },
  ): Promise<UpdateResult> {
    if (user.id !== id) {
      throw new UnauthorizedException('User ID does not match');
    }
    return this.usersService.deleteUserById(id);
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() { user },
  ): Promise<UpdateResult> {
    if (user.id !== id) {
      throw new UnauthorizedException('User ID does not match');
    }
    return this.usersService.updateUser(id, updateUserDto);
  }
}
