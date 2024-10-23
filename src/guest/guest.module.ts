import { Module } from '@nestjs/common';
import { GuestController } from './guest.controller';
import { GuestService } from './guest.service';
import { UsersModule } from '../users/users.module';
import { OrdersModule } from '../orders/orders.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [GuestController],
  providers: [GuestService],
  imports: [UsersModule, OrdersModule, AuthModule],
})
export class GuestModule {}
