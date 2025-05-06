import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '../../common/base/base.service';
import { SettingService } from '../settings/setting.service';
import { User } from '../users/user.entity';
import { Reinvest } from './reinvest.entity';

@Injectable()
export class ReinvestService extends BaseService<Reinvest> {
  constructor(
    @InjectRepository(Reinvest)
    public repository: Repository<Reinvest>,
    private readonly settingService: SettingService,
  ) {
    super(repository);
  }

  async investBalance(user: User) {
    if (!user.autoReinvestEnabled) return;
    const userBalance = Number(user.balance || 0);
    const refCommission: number = Number(user.referralCommission || 0);
    const [refBalance, rate] = await this.settingService.convertUsdAndToken(
      process.env.MAIN_TOKEN,
      refCommission,
      true,
    );
    const totalBalance = refBalance + userBalance;
    if (totalBalance < user.autoReinvestAmount) return;
  }
}
