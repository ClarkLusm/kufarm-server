import { Inject } from '@nestjs/common';
import { Console, Command, createSpinner } from 'nestjs-console';

import { SettingService } from '../app/settings/setting.service';
import { AdminUserService } from '../app/admin-users/admin-user.service';
import * as Constants from '../common/constants';

@Console()
export class SeedService {
  constructor(
    @Inject(SettingService) private settingService: SettingService,
    @Inject(AdminUserService) private adminUserService: AdminUserService,
  ) {}
  @Command({
    command: 'seed',
    description: 'Seed DB',
  })
  async seed(): Promise<void> {
    const spin = createSpinner();

    spin.start('Seeding the DB');

    await this.createAdminUser();
    await this.initialConfiguration();

    spin.succeed('Seeding done');
  }

  async createAdminUser() {
    return await this.adminUserService.create({
      username: 'admin',
      password: 'admin',
    });
  }

  async initialConfiguration() {
    return await this.settingService.create([
      {
        key: Constants.SETTING_INCOME_SHARE,
        value: {
          usd: 50,
          token: 50,
        },
      },
      {
        key: Constants.SETTING_EXCHANGE_RATE,
        value: {
          usd: 1,
          token: 1,
        },
      },
      {
        key: Constants.SETTING_NEW_USER_PROMOTION,
        value: {
          hashPower: 1,
          maxOut: 3,
        },
      },
      {
        key: Constants.SETTING_ICOME_RATE,
        value: 300,
      },
      {
        key: Constants.SETTING_REFERRAL_INCOME,
        value: {
          f1: 10,
          f2: 5,
          f3: 3,
          f4: 3,
          f5: 3,
          f6: 2,
          f7: 2,
          f8: 2,
          f9: 2,
          f10: 2,
          f11: 1,
          f12: 1,
          f13: 1,
          f14: 1,
          f15: 1,
        },
      },
    ]);
  }
}
