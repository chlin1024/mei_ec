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
import { UpdateResult } from 'typeorm';
import { UpdateUserDto } from './dto/updateUser.dto';
import { QueryUsersDto } from './dto/queryUsers.dto';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRoles } from './userRole.enum';
import { JwtGuard } from '../auth/guard/jwtAuthentication.guard';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiErrorResponses } from 'src/utils/decorator/api-response.decorator.';

@ApiTags('users')
@ApiErrorResponses()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Success.', type: User })
  @ApiOperation({ summary: 'test' })
  @Roles(UserRoles.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  getUser(@Query() queryUsersDto: QueryUsersDto): Promise<User[]> {
    return this.usersService.getUsers(queryUsersDto);
  }

  @Post()
  @ApiConflictResponse({
    description: 'Username already exists.',
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<'OK'> {
    await this.usersService.createUser(createUserDto);
    return 'OK';
  }

  @Delete()
  @ApiBearerAuth()
  @Roles(UserRoles.GUEST)
  @UseGuards(JwtGuard, RolesGuard)
  deleteUserById(@Req() { user }): Promise<UpdateResult> {
    return this.usersService.deleteUserById(user.id);
  }

  @Patch()
  @ApiBearerAuth()
  @Roles(UserRoles.GUEST)
  @UseGuards(JwtGuard, RolesGuard)
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() { user },
  ): Promise<UpdateResult> {
    return this.usersService.updateUser(user.id, updateUserDto);
  }
}
