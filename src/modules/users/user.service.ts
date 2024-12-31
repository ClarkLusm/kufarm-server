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
      username: data.email,
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
        id: Not(userId),
      },
      select: {
        id: true,
        email: true,
        referralPath: true,
      },
      skip: offset,
      take: limit,
    });
  }

  async syncBalance(userId: string) {
    const user = await this.getById(userId),
      userData = {
        income: Number(user.income || 0),
        balance: Number(user.balance || 0),
        syncAt: new Date(),
      },
      userProducts = await this.userProductService.getRunningProductsByUserId(
        userId,
      );

    if (userProducts.length) {
      if (user.income < user.maxOut) {
        const daysDuration = moment().diff(user.syncAt, 'day', true);
        const [dailyIncome, monthlyIncome, hashPower] = userProducts.reduce(
          (a, b) => [
            a[0] + Number(b.dailyIncome),
            a[1] + Number(b.monthlyIncome),
            a[2] + b.hashPower,
          ],
          [0, 0, 0],
        );

        let income = daysDuration * dailyIncome;
        const up: UserProduct = userProducts[0],
          upIncome = Number(up.income),
          incomeNeedToMax = up.maxOut - upIncome;

        const reachMax = income >= incomeNeedToMax; // true: the machine is fully
        if (reachMax) income = incomeNeedToMax;

        await this.dataSource.transaction(async (tx) => {
          await tx.getRepository(UserProduct).update(up.id, {
            income: reachMax ? up.maxOut : upIncome + income,
            status: reachMax
              ? UserProductStatusEnum.Stop
              : UserProductStatusEnum.Activated,
          });

          // Reach user maxout
          if (userData.income + income > user.maxOut) {
            income = user.maxOut - userData.income;
          }
          // Update user data
          userData.income += income;
          userData.balance += income;
          await tx.getRepository(User).update(userId, userData);
        });

        if (reachMax) {
          return await this.syncBalance(userId);
        }

        return {
          dailyIncome,
          monthlyIncome,
          hashPower,
          maxOut: user.maxOut,
          income: userData.income,
          balance: userData.balance,
        };
      } else {
        await this.dataSource.getRepository(UserProduct).update(
          userProducts.map((up) => up.id),
          {
            status: UserProductStatusEnum.Stop,
          },
        );
      }
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

  /**
   * @param parentPath // 1/
   * @param childPath // 1/2/3
   * @returns 2
   */
  getReferralLevelByPath(parentPath: string, childPath: string) {
    return childPath?.replace(parentPath, '')?.split('/')?.length - 1;
  }
}
