import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SettingModule } from '../settings/setting.module';
import { Reinvest } from './reinvest.entity';
import { ReinvestService } from './reinvest.service';

@Module({
  controllers: [],
  imports: [TypeOrmModule.forFeature([Reinvest]), SettingModule],
  providers: [ReinvestService],
  exports: [ReinvestService],
})
export class ReinvestModule {}
