import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  NestInterceptor,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Observable, tap } from 'rxjs';

export class loginSessionCacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    //const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(async (response) => {
        if (response?.token) {
          await this.cacheManager.set(
            response.token,
            response.user.username,
            3600 * 10 * 1000,
          );
        }
      }),
    );
  }
}
