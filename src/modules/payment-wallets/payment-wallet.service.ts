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
      data.chainId,
      data.walletAddress,
      data.coin,
    );
    return this.create({ ...data, balance });
  }

  async syncAccountBalance(wallet: PaymentWallet) {
    try {
      const accountReBalance = await this.ethersService.getBalance(
        wallet.chainId,
        wallet.walletAddress,
        wallet.coin,
      );
      await this.updateById(wallet.id, {
        balance: Number(accountReBalance.balance),
        updatedAt: new Date(),
      });
      return accountReBalance;
    } catch (error) {
      console.error('ERROR::syncAccountBalance', error);
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
