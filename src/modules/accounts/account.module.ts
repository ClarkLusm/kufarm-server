import { Module } from '@nestjs/common';

import { EthersModule } from '../../libs/ethers/ethers.module';
import { AccountController } from './account.controller';
import { UserModule } from '../users/user.module';
import { UserProductModule } from '../user-products/user-product.module';
import { PaymentWalletModule } from '../payment-wallets/payment-wallet.module';
import { TransactionModule } from '../transactions/transaction.module';
import { OrderModule } from '../orders/order.module';
import { JwtAuthModule } from '../auth/jwt/jwt-auth.module';
import { ProductModule } from '../products/product.module';
import { SettingModule } from '../settings/setting.module';
import { ReferralCommissionModule } from '../referral-commissions/referral-commission.module';

@Module({
  controllers: [AccountController],
  imports: [
    UserModule,
    UserProductModule,
    PaymentWalletModule,
    OrderModule,
    ProductModule,
    TransactionModule,
    SettingModule,
    ReferralCommissionModule,
    EthersModule,
    JwtAuthModule,
  ],
})
export class AccountModule {}
