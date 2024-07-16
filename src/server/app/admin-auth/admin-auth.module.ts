import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { JwtAuthModule } from './jwt/jwt-auth.module';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { AdminUserModule } from '../admin-users/admin-user.module';

@Module({
  controllers: [AdminAuthController],
  imports: [
    PassportModule,
    AdminUserModule,
    JwtAuthModule,
  ],
  providers: [AdminAuthService],
})
export class AdminAuthModule { }
