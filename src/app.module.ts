import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { GuestModule } from './guest/guest.module';
import { LoggingMiddleware } from './utils/middleware/logging.middleware';
import { MailerModule } from './mailer/mailer.module';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { EventEmitterModule } from '@nestjs/event-emitter';
import * as dotenv from 'dotenv';
dotenv.config();

const port = parseInt(process.env.REDIS_PORT) || 6379;
@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: port,
      },
    }),
    CacheModule.register({
      max: 100,
      ttl: 60 * 1000 * 30,
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: port,
    }),
    EventEmitterModule.forRoot(),
    UsersModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    GuestModule,
    MailerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
