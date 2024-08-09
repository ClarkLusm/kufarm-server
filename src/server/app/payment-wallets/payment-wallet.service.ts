import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, MoreThan, Repository } from 'typeorm';

import { EthersService } from '../../libs/ethers/ethers.service';
import { BaseService } from '../../common/base/base.service';
import { PaymentWallet } from './payment-wallet.entity';

@Injectable()
export class PaymentWalletService extends BaseService<PaymentWallet> {
  constructor(
    @InjectRepository(PaymentWallet)
    public repository: Repository<PaymentWallet>,
    private ethersService: EthersService,
    private readonly dataSource: DataSource,
  ) {
    super(repository);
  }

  async createWallet(data: PaymentWallet) {
    const balance = await this.ethersService.getBalance(
      data.walletAddress,
      data.coin,
    );
    return this.create({ ...data, balance });
  }

  async syncAccountBalance(walletId: string, address: string, coin: string) {
    try {
      const accountReBalance = await this.ethersService.getBalance(
        address,
        coin,
      );
      await this.update(walletId, {
        balance: Number(accountReBalance),
      });
      return accountReBalance;
    } catch (error) {
      console.error('account/withdraw::Cannot fetch account balance');
    }
  }

  async getWalletPayout(minBalance: number) {
    return this.findOneBy({
      isOut: true,
      published: true,
      balance: MoreThan(minBalance),
    });
  }
}
