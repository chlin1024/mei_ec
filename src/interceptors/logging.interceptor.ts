import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const now = Date.now();
    console.log(request);
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const duration = Date.now() - now;
        const { method, url } = request;
        const { statusCode } = response;
        const body = method !== 'GET' ? JSON.stringify(request.body) : '';
        const userId = user ? user.id : 'unknown';

        this.logger.verbose(
          `[HTTP] ${statusCode} ${duration}ms ${method} ${url} USER_ID: "${userId}" BODY: ${body}`,
        );
      }),
    );
  }
}
