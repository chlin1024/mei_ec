import { Module } from '@nestjs/common';
import { GuestController } from './guest.controller';
import { GuestService } from './guest.service';
import { UsersModule } from 'src/users/users.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  controllers: [GuestController],
  providers: [GuestService],
  imports: [UsersModule, OrdersModule],
})
export class GuestModule {}
