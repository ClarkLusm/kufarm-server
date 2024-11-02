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

  async getExchangeRate() {
    // Check the rate config whether is fixed or not
    const setting = await this.repository.findOneBy({
      key: Constants.SETTING_SYSTEM,
    });
    return setting?.value;
  }

  async convertUsdAndToken(
    amount: number,
    rateFromCache?: number,
    bep20ToUsd: boolean = false,
  ) {
    if (Constants.BTCO2_SYMBOL === process.env.MAIN_TOKEN) {
      return this.convertUsdAndBTCO2(amount, rateFromCache, bep20ToUsd);
    }
    if (Constants.KASPA_SYMBOL === process.env.MAIN_TOKEN) {
      return this.convertUsdAndKas(amount, bep20ToUsd);
    }
    return [];
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

  async convertUsdAndKas(
    amount: number,
    kasToUsd: boolean = false, //default convert usdt to kas
  ): Promise<[number, number]> {
    let rate: number | undefined = await this.getExchangeUSDPrice(
      Constants.KASPA_SYMBOL,
    );
    console.log('>>>>convertUsdAndKas::', rate);
    if (!rate || rate < 0) {
      throw new Error('Cannot fetch the exchange rate');
    }
    return [kasToUsd ? amount * rate : amount / rate, rate];
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

  async getExchangeUSDPrice(symbol) {
    try {
      const res = await axios.get(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`,
        {
          headers: {
            'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY,
          },
        },
      );
      const { data } = res.data;
      if (data[symbol]) {
        return data[symbol]?.quote?.USD?.price;
      }
    } catch (error) {
      console.error('>>>getExchangePrice', error);
    }
  }
}
