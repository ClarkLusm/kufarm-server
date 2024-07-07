import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { UserModule } from '../../users/user.module';
import { AuthService } from './auth.service';
import { JwtAuthModule } from './jwt/jwt-auth.module';

@Module({
  controllers: [AuthController],
  imports: [UserModule, JwtAuthModule],
  providers: [AuthService],
})
export class AuthModule {}
