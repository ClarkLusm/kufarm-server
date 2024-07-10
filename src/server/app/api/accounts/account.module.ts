import { Module } from '@nestjs/common';

import { AccountController } from './account.controller';
import { UserModule } from '../../users/user.module';
import { UserProductModule } from '../../user-products/user-product.module';
import { PaymentWalletModule } from '../../payment-wallet/payment-wallet.module';
import { BalanceTransactionModule } from '../../balance-transactions/balance-transaction.module';
import { OrderModule } from '../../orders/order.module';

@Module({
  controllers: [AccountController],
  imports: [
    UserModule,
    UserProductModule,PaymentWalletModule,
    OrderModule,
    BalanceTransactionModule,
  ],
})

export class AccountModule {}
  