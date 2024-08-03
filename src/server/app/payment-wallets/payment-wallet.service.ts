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

import { EthersService } from '../../libs/ethers/ethers.service';
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
    private ethersService: EthersService,
  ) {
    super(repository);
  }

  async createWallet(data: PaymentWallet) {
    const accountBalance = await this.ethersService.getBalance(
      data.walletAddress,
      data.coin,
    );
    return this.dataSource.transaction(async (tx) => {
      const wallet = await tx.getRepository(PaymentWallet).save(data);
      await tx.getRepository(PaymentAccount).save({
        paymentWalletId: wallet.id,
        accountAddress: wallet.walletAddress,
        balance: Number(accountBalance),
        coin: wallet.coin,
      });
    });
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
      });

    return account?.accountAddress;
  }

  // async genWalletAccount(wallet: PaymentWallet, index: number) {
  //   const HDWallet = ethers.HDNodeWallet.fromPhrase(
  //     wallet.secret,
  //     null,
  //     wallet.path,
  //   );
  //   const childAccount = HDWallet.derivePath(`${index}`);
  //   return childAccount.address;
  // }

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

  async syncAccountBalance(
    paymentAccountId: string,
    address: string,
    coin: string,
  ) {
    try {
      const accountReBalance = await this.ethersService.getBalance(
        address,
        coin,
      );
      await this.dataSource
        .getRepository(PaymentAccount)
        .update(paymentAccountId, {
          balance: Number(accountReBalance),
        });
      return accountReBalance;
    } catch (error) {
      console.error('account/withdraw::Cannot fetch account balance');
    }
  }
}
