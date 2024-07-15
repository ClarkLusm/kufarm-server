import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, LessThan, Not, Repository } from 'typeorm';
import ethers from 'ethers';

import { PaymentWallet } from './payment-wallet.entity';
import { BaseService } from 'src/server/common/base/base.service';
import { PaymentAccount } from './payment-account.entity';
import { Order } from '../orders/order.entity';
import { OrderStatusEnum } from 'src/server/common/enums';

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

    const busyAddresses = busyAccounts.map((a) => a.walletAddress);
    const account = await this.dataSource
      .getRepository(PaymentAccount)
      .findOneBy({
        paymentWalletId: wallet.id,
        accountAddress: Not(In(busyAddresses)),
      });

    if (account) return account.accountAddress;

    const accountAddress = await this.genWalletAccount();
    // Save new account
    if (accountAddress) {
      const newAccount = new PaymentAccount();
      newAccount.paymentWalletId = wallet.id;
      newAccount.accountAddress = accountAddress;
      await this.dataSource.getRepository(PaymentAccount).save(newAccount);
    }
    return accountAddress;
  }

  async genWalletAccount() {
    let privateKey =
      '0x0123456789012345678901234567890123456789012345678901234567890123';
    let wallet = new ethers.Wallet(privateKey);

    // Connect a wallet to mainnet
    let provider = ethers.getDefaultProvider();
    let walletWithProvider = new ethers.Wallet(privateKey, provider);
    let randomWallet = ethers.Wallet.createRandom();
    console.log(randomWallet);
    return randomWallet.address;
  }

}
