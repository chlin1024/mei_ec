import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
//import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { UsersService } from 'src/users/users.service';
import { JwtGuard } from './guard/jwtAuthentication.guard';
import { Request } from 'express';

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
  signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }
  // @Get('token')
  // login(@Body('token') token: string) {
  //   return ㄋthis.authService.getSessionByToken(token);
  // }

  @Put('token')
  @UseGuards(JwtGuard)
  logout(@Req() req: Request) {
    const jwtToken = req.headers.authorization.split(' ')[1];
    return this.authService.revokeSession(jwtToken);
  }
}
