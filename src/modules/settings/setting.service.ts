import axios from 'axios';
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

  async getSettingExchangeRate() {
    // Check the rate config whether is fixed or not
    const setting = await this.repository.findOneBy({
      key: Constants.SETTING_SYSTEM,
    });
    return setting?.value;
  }

  // Convert token to USD or vice versa
  async convertUsdAndToken(
    tokenSymbol: string,
    amount: number,
    tokenToUsd: boolean = false,
  ): Promise<[number, number]> {
    let rate: number = 0;
    const exchangeRate = await this.getSettingExchangeRate();
    if (!exchangeRate) {
      throw new Error('Cannot fetch the exchange rate');
    }
    const {
      exchangeUsd: usdRate,
      exchangeToken: tokenRate,
      exchangeFixed: fixed,
    } = exchangeRate;
    if (fixed) {
      rate = usdRate / tokenRate;
    } else {
      rate = await this.getExchangeUSDPrice(tokenSymbol);
    }
    return [tokenToUsd ? amount * rate : amount / rate, rate];
  }

  async getAppSettings() {
    const setting = await this.repository.findOneBy({
      key: Constants.SETTING_SYSTEM,
    });
    const res = setting?.value || {};
    if (!res.sessionMiningDuration) {
      res.sessionMiningDuration = Constants.SESSION_MINING_DURATION;
    }
    return res;
  }

  async getReinvestSettings() {
    const setting = await this.repository.findOneBy({
      key: Constants.SETTING_REINVEST,
    });
    return setting?.value || {};
  }

  async getReferralIncomeSettings() {
    const setting = await this.repository.findOneBy({
      key: Constants.SETTING_REFERRAL_INCOME,
    });
    return setting?.value;
  }

  async getExchangeUSDPrice(symbol) {
    try {
      const res = await axios.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`,
      );
      return res.data.price;
    } catch (error) {
      console.error('>>>getExchangePrice', error);
      throw new Error('Cannot fetch exchange rate');
    }
  }

  async getReinvestmentConfig() {
    const setting = await this.repository.findOneBy({
      key: Constants.SETTING_REINVEST,
    });
    return setting?.value;
  }
}
