import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }
  @Get('token')
  login(@Body('token') token: string) {
    return this.authService.getSessionByToken(token);
  }

  @Put('token')
  logout(@Body('token') token: string) {
    return this.authService.revokeSession(token);
  }
}
