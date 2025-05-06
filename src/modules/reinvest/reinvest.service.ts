import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import moment from 'moment';

import { BaseService } from '../../common/base/base.service';
import { MiningParams } from '../../common/types/mining-params';
import { ReinvestStatusEnum } from '../../common/enums/reinvest.enum';
import { SettingService } from '../settings/setting.service';
import { User } from '../users/user.entity';
import { Reinvest } from './reinvest.entity';
import { buildQueryFilter } from 'src/common/helpers/query-builder';

@Injectable()
export class ReinvestService extends BaseService<Reinvest> {
  constructor(
    @InjectRepository(Reinvest)
    public repository: Repository<Reinvest>,
    private readonly dataSource: DataSource,
    private readonly settingService: SettingService,
  ) {
    super(repository);
  }

  async getReinvestPackagesByUserId(userId: string) {
    const packages = await this.repository.find({
      where: {
        userId,
        status: ReinvestStatusEnum.Activated,
      },
    });
    const reinvestmentConfig =
      await this.settingService.getReinvestmentConfig();
    if (!reinvestmentConfig) {
      return [];
    }
    return await Promise.all(
      packages.map(async (item) => {
        if (item.maxOut <= item.income) {
          item.status = ReinvestStatusEnum.Stop;
        }
        await this.repository.save(item);
        const product = await this.dataSource.getRepository('Product').findOne({
          select: {
            id: true,
            hashPower: true,
          },
          where: {
            price: MoreThanOrEqual(item.amount),
            published: true,
          },
          order: {
            price: 'ASC',
          },
        });
        return {
          ...item,
          dailyIncome: (reinvestmentConfig.dailyIncome * item.amount) / 100,
          monthlyIncome: (reinvestmentConfig.monthlyIncome * item.amount) / 100,
          hashPower: product ? product.hashPower : 0,
        };
      }),
    );
  }

  async syncReinvest(user: User, reinvestmentConfig: MiningParams) {
    if (!user.miningAt) return;
    const reinvests = await this.repository.find({
      where: {
        userId: user.id,
        status: ReinvestStatusEnum.Activated,
      },
    });
    if (reinvests.length === 0) return;
    const setting = await this.settingService.getAppSettings();
    const sessionMiningDuration = setting?.sessionMiningDuration;
    // Check if the user has been mining for more than x hours
    const maxMiningAt = moment(user.miningAt).add(
      sessionMiningDuration,
      'hours',
    );
    await this.dataSource.transaction(async (tx) => {
      let totalIncome = 0;
      for (const reinvest of reinvests) {
        if (!reinvest.syncAt) reinvest.syncAt = user.miningAt;
        if (moment(reinvest.syncAt).isAfter(maxMiningAt)) {
          return;
        }
        const startAt = moment(reinvest.syncAt).isAfter(user.miningAt)
          ? reinvest.syncAt
          : user.miningAt;
        const endAt = moment().isAfter(maxMiningAt) ? maxMiningAt : moment();
        let daysDuration = endAt.diff(startAt, 'day', true);
        if (daysDuration > 1) daysDuration = 1;

        const income = reinvestmentConfig.dailyIncome * daysDuration;
        const maxIncome = reinvest.maxOut - reinvest.income;
        if (income > maxIncome) {
          reinvest.income = reinvest.maxOut;
        } else {
          reinvest.income += income;
        }
        reinvest.syncAt = moment().toDate();
        if (reinvest.maxOut <= reinvest.income) {
          reinvest.status = ReinvestStatusEnum.Stop;
        }
        await tx.getRepository(Reinvest).save(reinvest);
        totalIncome += income > maxIncome ? maxIncome : income;
      }
      if (totalIncome > 0) {
        user.balance = Number(user.balance || 0) + Number(totalIncome);
        await tx.getRepository(User).save(user);
      }
    });
  }

  async investBalance(user: User) {
    const reinvestmentConfig =
      await this.settingService.getReinvestmentConfig();
    if (!reinvestmentConfig) {
      console.error('ERROR::[ReinvestService] No reinvestment config found');
      return;
    }
    await this.syncReinvest(user, reinvestmentConfig);
    if (!user.autoReinvestEnabled) return;
    const userBalance = Number(user.balance || 0);
    const refCommission: number = Number(user.referralCommission || 0);
    const [refUsdBalance, tokenToUsdRate] =
      await this.settingService.convertUsdAndToken(
        process.env.MAIN_TOKEN,
        refCommission,
        true,
      );
    const totalBalance = refUsdBalance + userBalance;
    if (totalBalance < user.autoReinvestAmount) return;
    const reinvestUsdAmount = //USD amount
      parseInt(`${totalBalance / user.autoReinvestAmount}`) *
      user.autoReinvestAmount;
    let reinvestAmount = Number(reinvestUsdAmount);
    if (reinvestAmount >= refUsdBalance) {
      user.referralCommission = 0;
      reinvestAmount -= refUsdBalance;
    } else {
      const [reinvestTokenAmount] =
        await this.settingService.convertUsdAndToken(
          process.env.MAIN_TOKEN,
          reinvestAmount,
        );
      user.referralCommission -= reinvestTokenAmount;
      reinvestAmount = 0;
    }
    if (reinvestAmount >= userBalance) {
      user.balance = 0;
    } else {
      user.balance -= reinvestAmount;
    }
    await this.dataSource.transaction(async (tx) => {
      await tx.getRepository(Reinvest).save({
        userId: user.id,
        amount: reinvestUsdAmount,
        toUsdRate: tokenToUsdRate,
        income: 0,
        maxOut: reinvestmentConfig.maxOut,
        status: ReinvestStatusEnum.Activated,
      });
      await tx.getRepository(User).save(user);
    });
  }

  getAll(query?: any): Promise<[Reinvest[], number]> {
    const qr = buildQueryFilter(query);
    return this.repository.findAndCount(qr);
  }
}
