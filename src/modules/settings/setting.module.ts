import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Setting } from './setting.entity';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';

@Module({
  controllers: [SettingController],
  imports: [TypeOrmModule.forFeature([Setting])],
  providers: [SettingService],
  exports: [SettingService],
})
export class SettingModule {}
