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
import { loginSessionCacheInterceptor } from 'src/utils/interceptor/login-session.interceptor';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponses } from 'src/utils/decorator/api-response.decorator.';

@ApiTags('auth')
@ApiErrorResponses()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseInterceptors(loginSessionCacheInterceptor)
  signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }

  @Patch('logout')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  logout(@Req() req: Request) {
    const jwtToken = req.headers.authorization.split(' ')[1];
    return this.authService.revokeSession(jwtToken);
  }
}
