import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtGuard } from './guard/jwtAuthentication.guard';
import { Request } from 'express';
import { loginSessionCacheInterceptor } from 'src/interceptor/login-session.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseInterceptors(loginSessionCacheInterceptor)
  signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }

  @Patch('logout')
  @UseGuards(JwtGuard)
  logout(@Req() req: Request) {
    const jwtToken = req.headers.authorization.split(' ')[1];
    return this.authService.revokeSession(jwtToken);
  }
}
