import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from '../orders/order.entity';
import { PaymentWallet } from './payment-wallet.entity';
import { PaymentAccount } from './payment-account.entity';
import { PaymentWalletService } from './payment-wallet.service';
import { PaymentWalletController } from './payment-wallet.controller';

@Module({
  controllers: [PaymentWalletController],
  imports: [TypeOrmModule.forFeature([PaymentWallet, PaymentAccount, Order])],
  providers: [PaymentWalletService],
  exports: [PaymentWalletService],
})
export class PaymentWalletModule {}
