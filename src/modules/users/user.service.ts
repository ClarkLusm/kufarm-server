import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, DataSource, Not } from 'typeorm';
import bcrypt from 'bcrypt';
import moment from 'moment';

import { genReferralCode } from '../../utils/string.utils';
import { BaseService } from '../..//common/base/base.service';
import { UserProductStatusEnum } from '../../common/enums/user-product.enum';
import { NEW_MINING_START_DATE } from '../../common/constants';
import { ReinvestService } from '../reinvest/reinvest.service';
import { SettingService } from '../settings/setting.service';
import { UserProductService } from '../user-products/user-product.service';
import { UserProduct } from '../user-products/user-product.entity';
import { UpdateUserDto, CreateUserDto } from './dto';
import { User } from './user.entity';
import { ReinvestStatusEnum } from 'src/common/enums/reinvest.enum';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    public repository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly settingService: SettingService,
    private readonly userProductService: UserProductService,
    private readonly reinvestService: ReinvestService,
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

  async oldSyncBalance(userId: string) {
    const user = await this.getById(userId),
      userData = {
        income: Number(user.income || 0),
        balance: Number(user.balance || 0),
        syncAt: new Date(),
      },
      userProducts = await this.userProductService.getRunningProductsByUserId(
        userId,
        user.customHashPower,
        moment(NEW_MINING_START_DATE).toDate(),
      );

    if (userProducts.length) {
      if (user.income < user.maxOut) {
        const daysDuration = (
          moment().isAfter(NEW_MINING_START_DATE)
            ? moment(NEW_MINING_START_DATE)
            : moment()
        ).diff(user.syncAt, 'day', true);
        const dailyIncome = userProducts.reduce(
          (a, b) =>
            a + Number(b.product ? b.product.dailyIncome : b.dailyIncome),
          0,
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
      } else {
        await this.dataSource.getRepository(UserProduct).update(
          userProducts.map((up) => up.id),
          {
            status: UserProductStatusEnum.Stop,
          },
        );
      }
    }
  }

  async syncBalance(userId: string) {
    let user = await this.getById(userId);
    if (!user.miningAt && moment(user.syncAt).isBefore(NEW_MINING_START_DATE)) {
      await this.oldSyncBalance(userId);
      user = await this.getById(userId);
    }
    if (!user.miningAt) return;
    const userData: any = {
        income: Number(user.income || 0),
        balance: Number(user.balance || 0),
        syncAt: new Date(),
      },
      userProducts = await this.userProductService.getRunningProductsByUserId(
        userId,
        user.customHashPower,
      );

    if (user.income < user.maxOut) {
      const setting = await this.settingService.getAppSettings();
      const sessionMiningDuration = setting?.sessionMiningDuration;
      // Check if the user has been mining for more than x hours
      const maxMiningAt = moment(user.miningAt).add(
        sessionMiningDuration,
        'hours',
      );
      if (!user.syncAt) user.syncAt = user.miningAt;
      if (moment(user.syncAt).isAfter(maxMiningAt)) {
        return;
      }

      const startAt = moment(user.syncAt).isAfter(user.miningAt)
        ? user.syncAt
        : user.miningAt;
      const endAt = moment().isAfter(maxMiningAt) ? maxMiningAt : moment();
      let daysDuration = endAt.diff(startAt, 'day', true);
      if (daysDuration > 1) daysDuration = 1;
      const dailyIncome = userProducts.reduce(
        (a, b) => a + Number(b.product ? b.product.dailyIncome : b.dailyIncome),
        0,
      );

      if (userProducts.length) {
        let income = daysDuration * dailyIncome;
        let incomeRemain = income;
        const taskUserProducts = userProducts.reduce((a, b) => {
          if (incomeRemain > 0) {
            const incomeNeedToMax = b.maxOut - Number(b.income);
            const reachMax = incomeRemain >= incomeNeedToMax; // true: the machine is fully
            a.push({
              id: b.id,
              income: reachMax ? b.maxOut : Number(b.income) + incomeRemain,
              status: reachMax
                ? UserProductStatusEnum.Stop
                : UserProductStatusEnum.Activated,
            });
            incomeRemain -= reachMax ? incomeNeedToMax : incomeRemain;
          }
          return a;
        }, []);

        await this.dataSource.transaction(async (tx) => {
          taskUserProducts.forEach(async (up) => {
            await tx.getRepository(UserProduct).update(up.id, {
              income: up.income,
              status: up.status,
            });
          });

          // Reach user maxout
          if (userData.income + income > user.maxOut) {
            income = user.maxOut - userData.income;
          }
          // Update user data
          userData.income += income;
          userData.balance += income;
          // Reset miningAt after ending mining session
          if (endAt.isSame(maxMiningAt)) {
            userData.miningAt = null;
          }
          await tx.getRepository(User).update(userId, userData);
        });
        return;
      }
    }
    await this._stopMiningAndOffMachines(userId);
  }

  async _stopMiningAndOffMachines(userId: string) {
    const user = await this.getById(userId);
    if (!user.miningAt) return;
    await this.dataSource.transaction(async (tx) => {
      await tx.getRepository(User).update(userId, {
        miningAt: null,
      });
      await tx.getRepository(UserProduct).update(
        {
          userId,
          status: UserProductStatusEnum.Activated,
        },
        {
          status: UserProductStatusEnum.Stop,
        },
      );
    });
  }

  async getMiningInfo(userId: string) {
    const user = await this.getById(userId),
      res = {
        income: Number(user.income || 0),
        balance: Number(user.balance || 0),
        syncAt: user.syncAt,
        miningAt: user.miningAt,
      },
      userProducts = await this.userProductService.getRunningProductsByUserId(
        userId,
        user.customHashPower,
      );
    let dailyIncome = 0,
      monthlyIncome = 0,
      hashPower = 0;

    if (user.income < user.maxOut) {
      let daysDuration = moment().diff(user.syncAt, 'day', true);
      if (daysDuration > 1) daysDuration = 1;

      [dailyIncome, monthlyIncome, hashPower] = userProducts.reduce(
        (a, b) => [
          a[0] + Number(b.product ? b.product.dailyIncome : b.dailyIncome),
          a[1] + Number(b.product ? b.product.monthlyIncome : b.monthlyIncome),
          a[2] + Number(b.product ? b.product.hashPower : b.hashPower),
        ],
        [0, 0, 0],
      );
    } else {
      if (userProducts.length) {
        await this.dataSource.getRepository(UserProduct).update(
          userProducts.map((up) => up.id),
          {
            status: UserProductStatusEnum.Stop,
          },
        );
      }
    }

    const reinvestPackages =
      await this.reinvestService.getReinvestPackagesByUserId(userId);
    if (reinvestPackages.length) {
      const [d, m, h] = reinvestPackages
        .filter((i) => i.status === ReinvestStatusEnum.Activated)
        .reduce(
          (a, b) => [
            a[0] + Number(b.dailyIncome),
            a[1] + Number(b.monthlyIncome),
            a[2] + Number(b.hashPower),
          ],
          [0, 0, 0],
        );
      dailyIncome += d;
      monthlyIncome += m;
      hashPower += h;
    }

    return {
      dailyIncome,
      monthlyIncome,
      hashPower,
      maxOut: user.maxOut,
      ...res,
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

  // Increase countF1Referral for the parent user
  // when a new user buys a product
  async increaseF1Count(referralPath: string) {
    const parentUser = await this.getOne({ referralPath });
    if (parentUser) {
      parentUser.countF1Referral += 1;
      return await this.save(parentUser);
    }
  }

  async checkUpdateEmailValid(oldUserId: string, newEmail: string) {
    const email = newEmail.trim();
    const item = await this.getOne({
      email,
      id: Not(oldUserId),
    });
    return item == null;
  }

  async updateProfile(user: User, data: UpdateUserDto) {
    let letUpdate = false;
    if (data.email && data.email !== user.email) {
      const validEmail = await this.checkUpdateEmailValid(user.id, data.email);
      if (!validEmail) {
        throw new Error('Email has been used already');
      }
      user.email = data.email;
      letUpdate = true;
    }
    if (data.walletAddress) {
      user.walletAddress = data.walletAddress;
      letUpdate = true;
    }
    if (!user.bannedAt && data.banReason) {
      user.bannedAt = new Date();
      user.banReason = data.banReason;
      letUpdate = true;
    }
    if (user.bannedAt && !data.banReason) {
      user.bannedAt = null;
      user.banReason = null;
      letUpdate = true;
    }
    if (data.password) {
      const [passwordHash, salt] = this.hashPassword(data.password);
      user.passwordHash = passwordHash;
      user.salt = salt;
      letUpdate = true;
    }
    if (
      typeof data.emailVerified === 'boolean' &&
      data.emailVerified !== user.emailVerified
    ) {
      user.emailVerified = data.emailVerified;
      letUpdate = true;
    }
    if (letUpdate) {
      await this.save(user);
    }
  }
}
