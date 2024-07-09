import { Module } from '@nestjs/common';

import { AccountController } from './account.controller';
import { UserModule } from '../../users/user.module';
import { UserProductModule } from '../../user-products/user-product.module';
import { PaymentWalletModule } from '../../payment-wallet/payment-wallet.module';
import { PurchaseHistoryModule } from '../../purchase-history/purchase-history.module';
import { BalanceTransactionModule } from '../../balance-transactions/balance-transaction.module';

@Module({
  controllers: [AccountController],
  imports: [
    UserModule,
    UserProductModule,PaymentWalletModule,
    PurchaseHistoryModule,
    BalanceTransactionModule,
  ],
})

export class AccountModule {}
  