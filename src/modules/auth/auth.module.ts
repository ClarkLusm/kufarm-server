import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { UserModule } from '../users/user.module';
import { AuthService } from './auth.service';
import { JwtAuthModule } from './jwt/jwt-auth.module';
import { MailModule } from '../mail/mail.module';

@Module({
  controllers: [AuthController],
  imports: [UserModule, JwtAuthModule, MailModule],
  providers: [AuthService],
})
export class AuthModule {}
