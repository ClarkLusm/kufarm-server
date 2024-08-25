import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '../../common/base/base.service';
import * as Constants from '../../common/constants';
import { numberToBigInt } from '../../common/helpers/number.utils';
import { Setting } from './setting.entity';

@Injectable()
export class SettingService extends BaseService<Setting> {
  constructor(
    @InjectRepository(Setting)
    public repository: Repository<Setting>,
  ) {
    super(repository);
  }

  async getNewUserPromotion() {
    const setting = await this.repository.findOneBy({
      key: Constants.SETTING_NEW_USER_PROMOTION,
    });
    return setting?.value;
  }

  async getExchangeRate() {
    // Check the rate config whether is fixed or not
    const setting = await this.repository.findOneBy({
      key: Constants.SETTING_SYSTEM,
    });
    return setting?.value;
  }

  async convertUsdToBTCO2(usdAmount: number) {
    const exchangeRate = await this.getExchangeRate();
    if (!exchangeRate) {
      throw new Error('Cannot fetch exchange rate');
    }
    const {
      exchangeUsd: usdRate,
      exchangeToken: tokenRate,
      exchangeFixed: fixed,
    } = exchangeRate;
    const rate = usdRate / tokenRate; // token to usd
    const tokenBalance = numberToBigInt(usdAmount / rate, 18);
    return [tokenBalance, rate];
  }

  async getAppSettings() {
    const setting = await this.repository.findOneBy({
      key: Constants.SETTING_SYSTEM,
    });
    return setting?.value;
  }

  async getReferralIncomeSettings() {
    const setting = await this.repository.findOneBy({
      key: Constants.SETTING_REFERRAL_INCOME,
    });
    return setting?.value;
  }
}
