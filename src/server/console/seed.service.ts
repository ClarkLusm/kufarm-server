import { Inject } from '@nestjs/common';
import { Console, Command, createSpinner } from 'nestjs-console';

import { SettingService } from '../app/settings/setting.service';
import { AdminUserService } from '../app/admin-users/admin-user.service';
import { ProductService } from '../app/products/product.service';
import * as Constants from '../common/constants';

@Console()
export class SeedService {
  constructor(
    @Inject(SettingService) private settingService: SettingService,
    @Inject(AdminUserService) private adminUserService: AdminUserService,
    @Inject(ProductService) private productService: ProductService,
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
    await this.createProducts();

    spin.succeed('Seeding done');
  }

  async createAdminUser() {
    return this.adminUserService.createAdminUser();
  }

  async createProducts() {
    const products = [
      {
        name: 'Antminer Z9 MINI',
        alias: 'z9mini',
        hashPower: 1000,
        maxOut: 300,
        dailyIncome: 0.2,
        monthlyIncome: 6,
        price: 100,
        published: true,
      },
      {
        name: 'Antminer S9K',
        alias: 's9k',
        hashPower: 6250,
        maxOut: 1500,
        dailyIncome: 1.25,
        monthlyIncome: 37.5,
        price: 500,
        published: true,
      },
      {
        name: 'Antminer T17',
        alias: 't17',
        hashPower: 15000,
        maxOut: 3000,
        dailyIncome: 3,
        monthlyIncome: 90,
        price: 1000,
        published: true,
      },
      {
        name: 'Antminer S17 PRO',
        alias: 's17pro',
        hashPower: 87500,
        maxOut: 15000,
        dailyIncome: 17.5,
        monthlyIncome: 525,
        price: 5000,
        published: true,
      },
      {
        name: 'Antminer S19 XP',
        alias: 's19xp',
        hashPower: 200000,
        maxOut: 30000,
        dailyIncome: 40,
        monthlyIncome: 1200,
        price: 10000,
        published: true,
      },
      {
        name: 'Antminer S19 PRO',
        alias: 's19pro',
        hashPower: 675000,
        maxOut: 90000,
        dailyIncome: 135,
        monthlyIncome: 4050,
        price: 30000,
        published: true,
      },
    ];
    return Promise.all(
      products.map(async (p) => {
        await this.productService.create(p);
      }),
    );
  }

  async initialConfiguration() {
    return await this.settingService.create([
      {
        name: 'Cấu hình hệ thống',
        key: Constants.SETTING_SYSTEM,
        value: {
          incomeRate: 300,
          withdrawMin: 100,
          exchangeFixed: true,
          exchangeUsd: 1,
          exchangeToken: 1,
        },
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
