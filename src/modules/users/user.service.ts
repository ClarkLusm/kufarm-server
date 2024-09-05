import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DataSource, Not } from 'typeorm';
import bcrypt from 'bcrypt';
import moment from 'moment';

import { genReferralCode } from '../../utils/string.utils';
import { BaseService } from '../..//common/base/base.service';
import { UserProductStatusEnum } from '../../common/enums/user-product.enum';
import { SettingService } from '../settings/setting.service';
import { UserProductService } from '../user-products/user-product.service';
import { UserProduct } from '../user-products/user-product.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

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

  hashPassword(password) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordHash = bcrypt.hashSync(password, salt);
    return [passwordHash, salt];
  }

  async createNewUser(data: CreateUserDto) {
    const [passwordHash, salt] = this.hashPassword(data.password);
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
      syncAt: new Date(),
    };

    let referralUser: User;
    if (data.referralCode) {
      referralUser = await this.findOneBy({
        referralCode: data.referralCode,
      });
      //TODO: Check emailVerified
      if (!referralUser) {
        throw new Error('Referring user does not exist');
      }
      userData.referralBy = referralUser.id;
      userData.referralPath = referralUser.referralPath;
    }

    const setting = await this.settingService.getAppSettings();
    if (setting?.maxOutNewUser) {
      userData['maxOut'] = setting?.maxOutNewUser;
    }
    const user = await this.create(userData);

    if (referralUser) {
      //TODO: should check the f1 condition
      referralUser.countF1Referral += 1;
      this.save(referralUser);
    }

    const createdUser = await this.getById(user.id);

    let referralPath = `${createdUser.sid}/`;
    if (userData.referralPath) {
      referralPath = `${userData.referralPath}${createdUser.sid}/`;
    }
    await this.updateById(createdUser.id, { referralPath });
    this.generateReferralCode(createdUser.id);
  }

  async getReferralsByPath(
    userId: string,
    referralPath: string,
    offset?: number,
    limit?: number,
  ) {
    return this.findAndCount({
      where: {
        referralPath: Like(`${referralPath}%`),
        id: Not(userId)
      },
      select: {
        id: true,
        email: true,
        receiverCommissions: {
          id: true,
          btco2Value: true,
          level: true,
        },
      },
      relation: {
        receiverCommissions: true,
      },
      skip: offset,
      take: limit,
    });
  }

  async syncBalance(userId: string) {
    const user = await this.getById(userId),
      userData = {
        income: Number(user.income),
        balance: Number(user.balance),
        syncAt: new Date(),
      },
      userProducts = await this.userProductService.getRunningProductsByUserId(
        userId,
      );

    if (userProducts.length && user.income < user.maxOut) {
      const daysDuration = moment().diff(user.syncAt, 'day', true);
      let totalIncome = 0,
        [dailyIncome, monthlyIncome, hashPower] = userProducts.reduce(
          (a, b) => [
            a[0] + Number(b.dailyIncome),
            a[1] + Number(b.monthlyIncome),
            a[2] + b.hashPower,
          ],
          [0, 0, 0],
        );

      await this.dataSource.transaction(async (tx) => {
        for (let i = 0; i < userProducts.length; i++) {
          const up: UserProduct = userProducts[i],
            upIncome = Number(up.income),
            upMonthlyIncome = Number(up.monthlyIncome),
            upDailyIncome = Number(up.dailyIncome);

          const income = daysDuration * upDailyIncome;
          const incomeNeedToMax = up.maxOut - upIncome;
          const reachMax = income > incomeNeedToMax; // true: the machine is fully

          await tx.getRepository(UserProduct).update(up.id, {
            income: reachMax ? up.maxOut : (Number(up.income) + income),
            status: reachMax
              ? UserProductStatusEnum.Stop
              : UserProductStatusEnum.Activated,
          });

          if (reachMax) {
            dailyIncome -= upDailyIncome;
            monthlyIncome -= upMonthlyIncome;
            hashPower -= up.hashPower;
            totalIncome += incomeNeedToMax;
          } else {
            totalIncome += income;
            break;
          }
        }

        // Update user data
        if (totalIncome) {
          userData.income += totalIncome;
          userData.balance += totalIncome;
        }
        if (userData.income > user.maxOut) {
          userData.income = user.maxOut;
        }
        await tx.getRepository(User).update(userId, userData);
      });

      return {
        dailyIncome,
        monthlyIncome,
        hashPower,
        maxOut: user.maxOut,
        income: userData.income,
        balance: userData.balance,
      };
    }
    return {
      dailyIncome: 0,
      monthlyIncome: 0,
      hashPower: 0,
      maxOut: user.maxOut,
      income: userData.income,
      balance: userData.balance,
    };
  }

  async generateReferralCode(userId: string) {
    try {
      let retry = 0;
      const checkExist = async () => {
        if (retry === 5) return;
        ++retry;
        const code = genReferralCode();
        const exist = await this.findOneBy({ referralCode: code });
        return exist ? checkExist() : code;
      };
      const code = await checkExist();
      if (code) {
        this.updateById(userId, { referralCode: code });
      }
    } catch (error) {
      console.error(error);
    }
  }
}
