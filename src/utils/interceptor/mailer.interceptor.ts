import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, tap } from 'rxjs';

@Injectable()
export class MailerInterceptor implements NestInterceptor {
  constructor(private eventEmitter: EventEmitter2) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((response) => {
        console.log(response);
        if (response?.orderInfo) {
          this.eventEmitter.emit('order.created', response);
        }
        if (response?.address) {
          this.eventEmitter.emit('user.registered', response);
        }
      }),
    );
  }
}
