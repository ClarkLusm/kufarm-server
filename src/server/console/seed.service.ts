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
    return this.adminUserService.createAdminUser();
  }

  async initialConfiguration() {
    return await this.settingService.create([
      {
        name: 'Tỉ giá',
        key: Constants.SETTING_EXCHANGE_RATE,
        value: {
          usd: 1,
          token: 1,
        },
      },
      {
        name: 'Đăng ký thành viên',
        key: Constants.SETTING_NEW_USER_PROMOTION,
        value: {
          hashPower: 1,
          maxOut: 3,
        },
      },
      {
        name: 'Tỉ lệ lợi nhuận',
        key: Constants.SETTING_ICOME_RATE,
        value: 300,
      },
      {
        name: 'Tỉ lệ hoa hồng',
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
      {
        name: 'Điều kiện nhận hoa hồng',
        key: Constants.SETTING_REFERRAL_INCOME_CONDITION,
        value: {
          f1: 1,
          f2: 2,
          f3: 3,
          f4: 4,
          f5: 5,
          f6: 6,
          f7: 7,
          f8: 8,
          f9: 9,
          f10: 10,
          f11: 10,
          f12: 10,
          f13: 10,
          f14: 10,
          f15: 10,
        },
      },
    ]);
  }
}
