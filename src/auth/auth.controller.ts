import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtGuard } from './guard/jwtAuthentication.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }

  @Put('token')
  @UseGuards(JwtGuard)
  logout(@Req() req: Request) {
    const jwtToken = req.headers.authorization.split(' ')[1];
    return this.authService.revokeSession(jwtToken);
  }
}
