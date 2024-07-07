import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '../users/user.module';
import { JwtAuthModule } from './jwt/jwt-auth.module';
import { AdminAuthController } from './admin-auth.controller';

@Module({
  controllers: [AdminAuthController],
  imports: [
    UserModule,
    PassportModule,
    JwtAuthModule,
  ],
})
export class AuthModule {}
