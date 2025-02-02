import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const jwtToken = request.headers.authorization.split(' ')[1];
      if (!jwtToken) {
        throw new UnauthorizedException();
      }
      request.user = this.jwtService.verify(jwtToken);
      const session = await this.cacheManager.get(jwtToken);
      if (!session) {
        await this.authService.getSessionByToken(jwtToken);
      }
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
