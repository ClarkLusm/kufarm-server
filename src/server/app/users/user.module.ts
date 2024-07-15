import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SettingModule } from '../settings/setting.module';
import { UserProductModule } from '../user-products/user-product.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SettingModule, UserProductModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
