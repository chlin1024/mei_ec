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
  UseInterceptors,
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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiErrorResponses } from 'src/utils/decorator/api-response.decorator.';
import { MailerInterceptor } from 'src/utils/interceptor/mailer.interceptor';
import { CreateUserResDto } from './dto/createUserRes.dto';

@ApiTags('users')
@ApiErrorResponses()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Success.', type: User })
  @ApiOperation({ summary: 'Get Users data' })
  @Roles(UserRoles.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  getUser(@Query() queryUsersDto: QueryUsersDto): Promise<User[]> {
    return this.usersService.getUsers(queryUsersDto);
  }

  @Post()
  @ApiConflictResponse({
    description: 'Username already exists.',
  })
  @ApiCreatedResponse({ description: 'User Created.', type: CreateUserResDto })
  @UseInterceptors(MailerInterceptor)
  createUser(@Body() createUserDto: CreateUserDto): Promise<CreateUserResDto> {
    return this.usersService.createUser(createUserDto);
  }

  @Delete()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Success.' })
  @Roles(UserRoles.GUEST)
  @UseGuards(JwtGuard, RolesGuard)
  deleteUserById(@Req() { user }): Promise<UpdateResult> {
    return this.usersService.deleteUserById(user.id);
  }

  @Patch()
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Success.' })
  @Roles(UserRoles.GUEST)
  @UseGuards(JwtGuard, RolesGuard)
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() { user },
  ): Promise<UpdateResult> {
    return this.usersService.updateUser(user.id, updateUserDto);
  }
}
