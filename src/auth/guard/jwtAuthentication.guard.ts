import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const request = context.switchToHttp().getRequest();
      const jwtToken = request.headers.authorization.split(' ')[1];
      if (!jwtToken) {
        throw new UnauthorizedException();
      }
      request.user = this.jwtService.verify(jwtToken);

      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
