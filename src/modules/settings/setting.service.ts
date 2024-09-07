import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '../../common/base/base.service';
import * as Constants from '../../common/constants';
import { Setting } from './setting.entity';

@Injectable()
export class SettingService extends BaseService<Setting> {
  constructor(
    @InjectRepository(Setting)
    public repository: Repository<Setting>,
  ) {
    super(repository);
  }

  async getExchangeRate() {
    // Check the rate config whether is fixed or not
    const setting = await this.repository.findOneBy({
      key: Constants.SETTING_SYSTEM,
    });
    return setting?.value;
  }

  async convertUsdAndBTCO2(
    amount: number,
    rateFromCache?: number,
    btco2ToUsd: boolean = false, //default convert from usd to btco2
  ): Promise<[number, number]> {
    let rate: number = rateFromCache || 0;
    if (!rate || rate < 0) {
      const exchangeRate = await this.getExchangeRate();
      if (!exchangeRate) {
        throw new Error('Cannot fetch the exchange rate');
      }
      const {
        exchangeUsd: usdRate,
        exchangeToken: tokenRate,
        exchangeFixed: fixed, //TODO: Check fixed or not
      } = exchangeRate;
      rate = usdRate / tokenRate; // token to usd
    }
    return [btco2ToUsd ? amount * rate : amount / rate, rate];
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
