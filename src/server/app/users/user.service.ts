import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { BaseService } from 'src/server/common/base/base.service';
import { SettingService } from '../settings/setting.service';
import { UserProductService } from '../user-products/user-product.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import moment from 'moment';
import { UserProduct } from '../user-products/user-product.entity';
import { UserProductStatusEnum } from 'src/server/common/enums/user-product.enum';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    public repository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly settingService: SettingService,
    private readonly userProductService: UserProductService,
  ) {
    super(repository);
  }

  async createNewUser(data: CreateUserDto) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordHash = bcrypt.hashSync(data.password, salt);
    const userData = {
      username: data.username,
      email: data.email,
      passwordHash,
      salt,
      walletAddress: data.walletAddress,
      balanceUsd: BigInt(0),
      balanceToken: BigInt(0),
      referralBy: null,
      referralPath: null,
    };

    if (data.referralId) {
      const referralUser = await this.getById(data.referralId);
      if (!referralUser || !referralUser?.emailVerified) {
        throw new Error('Referral user is not existed');
      }
      userData.referralBy = referralUser.id;
      userData.referralPath = referralUser.referralPath;
    }

    const promotion = await this.settingService.getNewUserPromotion();
    if (promotion?.maxOut) {
      userData['maxOut'] = promotion?.maxOut;
    }
    const user = await this.create(userData);

    if (userData.referralPath) {
      const referralPath = `${userData.referralPath}${user.sid}/`;
      this.updateById(user.id, { referralPath });
    }
    return user.id;
  }

  async getReferralsByPath(
    referralPath: string,
    offset?: number,
    limit?: number,
  ) {
    return this.findAndCount({
      where: {
        referralBy: Like(`${referralPath}%`),
      },
      select: {
        id: true,
        email: true,
        referralIncomeUsd: true,
      },
      skip: offset,
      take: limit,
    });
  }

  async syncBalance(userId: string) {
    const user = await this.getById(userId);
    const userProducts =
      await this.userProductService.getRunningProductsByUserId(userId);
    if (userProducts.length && user.income < user.maxOut) {
      const daysDuration = moment().diff(user.syncAt, 'day', true);
      let totalIncome = 0,
        [dailyIncome, monthlyIncome, hashPower] = userProducts.reduce(
          (a, b) => [
            a[0] + b.dailyIncome,
            a[1] + b.monthlyIncome,
            a[2] + b.hashPower,
          ],
          [0, 0, 0],
        );

      await this.dataSource.transaction(async (tx) => {
        for (let i = 0; i < userProducts.length; i++) {
          const up: UserProduct = userProducts[0];
          const income = daysDuration * up.dailyIncome;
          const incomeNeedToMax = up.maxOut - up.income;
          const reachMax = income > incomeNeedToMax; // true: the machine is fully

          await tx.getRepository(UserProduct).update(up.id, {
            income: reachMax ? up.maxOut : income,
            status: reachMax
              ? UserProductStatusEnum.Stop
              : UserProductStatusEnum.Activated,
          });

          if (reachMax) {
            dailyIncome -= up.dailyIncome;
            monthlyIncome -= up.monthlyIncome;
            hashPower -= up.hashPower;
            totalIncome += incomeNeedToMax;
          } else {
            totalIncome += income;
            break;
          }
        }

        const userData = { syncAt: new Date() };
        if (totalIncome) {
          userData['income'] = user.income + totalIncome;
          userData['balance'] = user.balance + totalIncome;
        }

        await tx.getRepository(User).update(userId, userData);
      });

      return {
        dailyIncome,
        monthlyIncome,
        hashPower,
      };
    }
  }
}
