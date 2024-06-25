import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(authDto: AuthDto) {
    const { userName, password } = authDto;
    const user = await this.usersService.getUserByUserName(userName);
    if (user.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { Id: user.id, username: user.userName };
    const jwtToken = await this.jwtService.signAsync(payload);
    return { access_token: jwtToken };
  }
}
