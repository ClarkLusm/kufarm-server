import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { BaseService } from '../../common/base/base.service';
import { SYMBOLS } from '../../common/constants';
import { SettingService } from '../settings/setting.service';
import { User } from '../users/user.entity';
import { ReferralCommission } from './referral-commission.entity';

@Injectable()
export class ReferralCommissionService extends BaseService<ReferralCommission> {
  constructor(
    @InjectRepository(ReferralCommission)
    public repository: Repository<ReferralCommission>,
    private readonly dataSource: DataSource,
    private readonly settingService: SettingService,
  ) {
    super(repository);
  }

  async addReferralCommission(
    userId: string,
    referralPath: string,
    amount: number,
  ) {
    try {
      console.log('LOG::[addReferralCommission]', userId, referralPath, amount);
      if (referralPath?.match(/\//g)?.length > 1) {
        const referralUserSids = referralPath.split('/');
        referralUserSids.pop();
        referralUserSids.pop();
        const countReferralUser = referralUserSids.length;
        if (countReferralUser) {
          referralUserSids.reduce(async (previousPromise, sid, index) => {
            await previousPromise;
            try {
              const level = countReferralUser - index;
              const receiver = await this.dataSource
                .getRepository(User)
                .findOneBy({ sid: Number(sid) });
              if (receiver) {
                //TODO: Check the receiver is verified or not
                const settings =
                  await this.settingService.getReferralIncomeSettings();
                const commissionSetting = settings?.commission,
                  conditionSetting = settings?.condition;
                const conditionLevel: number = conditionSetting?.[`f${level}`]; // Need n F1 to receive commission
                const incomePercent: number = commissionSetting?.[`f${level}`];

                // Enough the condition
                if (
                  receiver.countF1Referral >= conditionLevel &&
                  incomePercent
                ) {
                  const commission = amount * (incomePercent / 100);
                  const referralCom = await this.findOneBy({
                    userId,
                    receiverId: receiver.id,
                  });
                  await this.dataSource.transaction(async (tx) => {
                    if (referralCom) {
                      const values: any = {
                        withdrawValue:
                          Number(referralCom.withdrawValue) + amount,
                      };
                      if (process.env.MAIN_TOKEN == SYMBOLS.BTCO2) {
                        values.btco2Value =
                          Number(referralCom.btco2Value) + commission;
                      } else if (process.env.MAIN_TOKEN == SYMBOLS.KASPA) {
                        values.kasValue =
                          Number(referralCom.kasValue) + commission;
                      } else if (process.env.MAIN_TOKEN == SYMBOLS.CAKE) {
                        values.cakeValue =
                          Number(referralCom.cakeValue) + commission;
                      }
                      await tx
                        .getRepository(ReferralCommission)
                        .update(referralCom.id, values);
                    } else {
                      const values: any = {
                        userId,
                        receiverId: receiver.id,
                        level,
                        withdrawValue: amount,
                        coin: process.env.MAIN_TOKEN,
                      };
                      if (process.env.MAIN_TOKEN == SYMBOLS.BTCO2) {
                        values.btco2Value = commission;
                      } else if (process.env.MAIN_TOKEN == SYMBOLS.KASPA) {
                        values.kasValue = commission;
                      } else if (process.env.MAIN_TOKEN == SYMBOLS.CAKE) {
                        values.cakeValue = commission;
                      }
                      await tx.getRepository(ReferralCommission).save(values);
                    }
                    await tx.getRepository(User).update(receiver.id, {
                      referralCommission:
                        Number(receiver.referralCommission) + commission,
                    });
                  });
                }
              }
            } catch (error) {
              console.error(
                'ERROR::[addReferralCommission]',
                `userId: ${userId}`,
                `sid: ${sid}`,
                error,
              );
            }
            return Promise.resolve();
          }, Promise.resolve());
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}
