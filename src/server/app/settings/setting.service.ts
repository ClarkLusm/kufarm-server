import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from 'src/server/common/base/base.service';
import * as Constants from 'src/server/common/constants';
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
      key: Constants.SETTING_EXCHANGE_RATE,
    });
    return setting?.value;
  }
}
