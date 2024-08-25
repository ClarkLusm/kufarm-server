import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SettingModule } from '../settings/setting.module';
import { ReferralCommission } from './referral-commission.entity';
import { ReferralCommissionService } from './referral-commission.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReferralCommission]), SettingModule],
  providers: [ReferralCommissionService],
  exports: [ReferralCommissionService],
})
export class ReferralCommissionModule {}
