import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SettingModule } from '../settings/setting.module';
import { ReinvestModule } from '../reinvest/reinvest.module';
import { UserProductModule } from '../user-products/user-product.module';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    SettingModule,
    UserProductModule,
    ReinvestModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})

export class UserModule {}
