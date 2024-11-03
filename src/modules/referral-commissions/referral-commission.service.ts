import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { BaseService } from '../../common/base/base.service';
import { SYMBOLS } from '../../common/constants';
import { SettingService } from '../settings/setting.service';
import { User } from '../users/user.entity';
import { ReferralCommission } from './referral-commission.entity';

const MAIN_TOKEN = process.env.MAIN_TOKEN;

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

  async addReferralCommission(userId: string, amount: number) {
    try {
      const user = await this.dataSource
        .getRepository(User)
        .findOneBy({ id: userId });
      if (user?.referralPath?.match(/\//g)?.length > 1) {
        let referralPath = user?.referralPath;
        const referralUserSids = referralPath.split('/');
        referralUserSids.pop();
        referralUserSids.pop();
        const countReferralUser = referralUserSids.length;
        if (countReferralUser) {
          await Promise.all(
            referralUserSids.map(async (sid, index) => {
              const level = countReferralUser - index;
              const user = await this.dataSource
                .getRepository(User)
                .findOneBy({ sid: Number(sid) });
              if (user) {
                //TODO: Check the user is verified or not
                const settings =
                  await this.settingService.getReferralIncomeSettings();
                const commissionSetting = settings?.commission,
                  conditionSetting = settings?.condition;
                const conditionLevel: number = conditionSetting?.[`f${level}`]; // Need n F1 to receive commission
                const incomePercent: number = commissionSetting?.[`f${level}`];

                // Enough the condition
                if (user.countF1Referral >= conditionLevel && incomePercent) {
                  const commission = amount * (incomePercent / 100),
                    userCommission =
                      Number(user.referralCommission) + commission;

                  const referralCom = await this.findOneBy({
                    userId,
                    receiverId: user.id,
                  });
                  this.dataSource.transaction(async (tx) => {
                    if (referralCom) {
                      const values: any = {
                        withdrawValue: referralCom.withdrawValue + amount,
                      };
                      if (MAIN_TOKEN == SYMBOLS.BTCO2) {
                        values.btco2Value = referralCom.btco2Value + commission;
                      } else if (MAIN_TOKEN == SYMBOLS.KASPA) {
                        values.kasValue = referralCom.kasValue + commission;
                      }
                      await tx
                        .getRepository(ReferralCommission)
                        .update(referralCom.id, values);
                    } else {
                      const values: any = {
                        userId,
                        receiverId: user.id,
                        level,
                        withdrawValue: amount,
                        coin: MAIN_TOKEN,
                      };
                      if (MAIN_TOKEN == SYMBOLS.BTCO2) {
                        values.btco2Value = commission;
                      } else if (MAIN_TOKEN == SYMBOLS.KASPA) {
                        values.kasValue = commission;
                      }
                      await tx.getRepository(ReferralCommission).save(values);
                    }
                    await tx
                      .getRepository(User)
                      .update(user.id, { referralCommission: userCommission });
                  });
                }
              }
            }),
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}
