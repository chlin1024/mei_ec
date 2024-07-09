import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { omit } from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginSession } from './loginSession.entity';
import { IsNull, Repository, UpdateResult } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(LoginSession)
    private loginSessionRepository: Repository<LoginSession>,
  ) {}

  async signIn(authDto: AuthDto) {
    const { userName, passWord } = authDto;
    const user = await this.usersService.getUserByUserName(userName);
    const isMatch = await bcrypt.compare(passWord, user.password);
    if (!isMatch) {
      throw new UnauthorizedException(`wrong username or password`);
    }
    const jwtToken = await this.createSession(user);
    return { user: omit(user, ['password']), token: jwtToken };
  }

  async createSession(user: User) {
    const payload = {
      id: user.id,
      username: user.userName,
      role: user.role,
    };
    const jwtToken = await this.jwtService.signAsync(payload, {
      expiresIn: '10h',
    });
    const session = new LoginSession();
    session.token = jwtToken;
    session.userId = user.id;
    session.createdAt = new Date(Date.now());
    session.expiredAt = new Date(Date.now() + 3600 * 10 * 1000);
    await this.loginSessionRepository.save(session);
    return session.token;
  }

  async getSessionByToken(token: string): Promise<LoginSession> {
    const session = await this.loginSessionRepository.findOne({
      where: {
        token: token,
        revokedAt: IsNull(),
      },
    });
    if (!session) {
      throw new NotFoundException(`Session Not Found`);
    }
    return session;
  }

  async revokeSession(token: string): Promise<UpdateResult> {
    try {
      const session = await this.getSessionByToken(token);

      const result = await this.loginSessionRepository.softDelete(session.id);
      return result;
    } catch (error) {
      return error;
      //throw new Error(`Failed to revoke session: ${error.message}`);
    }
  }
}
