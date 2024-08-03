import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { BaseService } from '../../common/base/base.service';
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

  async addReferralCommission(userId: string, amount: number) {
    try {
      const user = await this.dataSource
        .getRepository(User)
        .findOneBy({ id: userId });
      if (user?.referralPath?.match(/\//g)?.length > 1) {
        let referralPath = user?.referralPath;
        const referralUserSids = referralPath.split('/');
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
                const conditionLevel: number = conditionSetting?.[`f${level}`]; // Need x F1 to receive commission
                const incomePercent: number = commissionSetting?.[`f${level}`];
                // Enough the condition
                if (user.countF1Referral >= conditionLevel && incomePercent) {
                  const commission = amount * incomePercent * 1e16, // 1e16 = /100 * 1e18 BITCO2 decimals
                    userCommission = user.referralCommission + commission;
                  const referralCom = await this.findOneBy({
                    userId,
                    receiverId: user.id,
                  });
                  this.dataSource.transaction(async (tx) => {
                    if (referralCom) {
                      const referralComValue = referralCom.value + commission;
                      await tx
                        .getRepository(ReferralCommission)
                        .update(referralCom.id, { value: referralComValue });
                    } else {
                      await tx.getRepository(ReferralCommission).save({
                        userId,
                        receiverId: user.id,
                        level,
                        value: commission,
                        coin: 'BITCO2', //Fixed
                      });
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
    } catch (error) {}
  }
}
