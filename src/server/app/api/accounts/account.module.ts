import { Module } from '@nestjs/common';

import { EthersModule } from 'src/server/libs/ethers/ethers.module';
import { AccountController } from './account.controller';
import { UserModule } from '../../users/user.module';
import { UserProductModule } from '../../user-products/user-product.module';
import { PaymentWalletModule } from '../../payment-wallet/payment-wallet.module';
import { TransactionModule } from '../../transactions/transaction.module';
import { OrderModule } from '../../orders/order.module';

@Module({
  controllers: [AccountController],
  imports: [
    UserModule,
    UserProductModule,
    PaymentWalletModule,
    OrderModule,
    TransactionModule,
    EthersModule,
  ],
})
export class AccountModule {}
