import {
  Body,
  Controller,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
//import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { UsersService } from 'src/users/users.service';
import { JwtValidationPipe } from './pipe/jwtValidation.pipe';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  // @Post('signup')
  // signUp(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.createUser(createUserDto);
  // }

  @Post('login')
  @UsePipes(ValidationPipe)
  signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }
  // @Get('token')
  // login(@Body('token') token: string) {
  //   return this.authService.getSessionByToken(token);
  // }

  @Put('token')
  @UsePipes(JwtValidationPipe)
  logout(@Body('token') token: string) {
    return this.authService.revokeSession(token);
  }
}
