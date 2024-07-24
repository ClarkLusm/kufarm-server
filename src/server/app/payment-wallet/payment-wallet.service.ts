import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  FindManyOptions,
  In,
  LessThan,
  Not,
  Repository,
} from 'typeorm';
import { ethers } from 'ethers';

import { BaseService } from '../../common/base/base.service';
import { OrderStatusEnum } from '../../common/enums';
import { Order } from '../orders/order.entity';
import { PaymentAccount } from './payment-account.entity';
import { PaymentWallet } from './payment-wallet.entity';

@Injectable()
export class PaymentWalletService extends BaseService<PaymentWallet> {
  constructor(
    @InjectRepository(PaymentWallet)
    public repository: Repository<PaymentWallet>,
    private dataSource: DataSource,
  ) {
    super(repository);
  }

  async getAvaiableAccount(wallet: PaymentWallet) {
    const busyAccounts = await this.dataSource.getRepository(Order).find({
      where: {
        status: OrderStatusEnum.Pending,
        expiredAt: LessThan(new Date()),
      },
      select: {
        walletAddress: true,
      },
    });

    if (!busyAccounts.length) return wallet.walletAddress;

    const busyAddresses = busyAccounts.map((a) => a.walletAddress);
    const account = await this.dataSource
      .getRepository(PaymentAccount)
      .findOne({
        where: {
          paymentWalletId: wallet.id,
          accountAddress: Not(In(busyAddresses)),
        },
        order: {
          path: 'DESC',
        },
      });

    if (account) return account.accountAddress;

    const lastAccount = await this.dataSource
      .getRepository(PaymentAccount)
      .findOne({
        select: {
          path: true,
        },
        where: {
          paymentWalletId: wallet.id,
        },
        order: {
          path: 'DESC',
        },
      });

    const nextPath = lastAccount ? Number(lastAccount.path) + 1 : 1;
    const accountAddress = await this.genWalletAccount(wallet, nextPath);
    // Save new account
    if (accountAddress) {
      const newAccount = new PaymentAccount();
      newAccount.paymentWalletId = wallet.id;
      newAccount.accountAddress = accountAddress;
      newAccount.path = nextPath.toString();
      await this.dataSource.getRepository(PaymentAccount).save(newAccount);
    }
    return accountAddress;
  }

  async genWalletAccount(wallet: PaymentWallet, index: number) {
    const HDWallet = ethers.HDNodeWallet.fromPhrase(
      wallet.secret,
      null,
      wallet.path,
    );
    const childAccount = HDWallet.derivePath(`${index}`);
    return childAccount.address;
  }

  async getAccountPayout(minBalance: number) {
    return this.dataSource
      .getRepository(PaymentAccount)
      .createQueryBuilder('payment_account')
      .leftJoinAndSelect('payment_account.paymentWallet', 'paymentWallet')
      .where('paymentWallet.is_out = true')
      .andWhere('paymentWallet.published = true')
      .andWhere('payment_account.balance >= :balance', {
        balance: minBalance,
      })
      .getOne();
  }

  async createAccount(data) {
    return this.dataSource.getRepository(PaymentAccount).save(data);
  }

  async updateAccountById(accountId: string, data) {
    return this.dataSource
      .getRepository(PaymentAccount)
      .update(accountId, data);
  }

  async getAndCountAccounts(query: FindManyOptions) {
    return this.dataSource.getRepository(PaymentAccount).findAndCount(query);
  }
}
