import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginSession } from './loginSession.entity';
import { jwtConstants } from './jwt.constants';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10h' },
    }),

    TypeOrmModule.forFeature([LoginSession]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
