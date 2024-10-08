import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EthersModule } from '../../libs/ethers/ethers.module';
import { PaymentWallet } from './payment-wallet.entity';
import { PaymentWalletService } from './payment-wallet.service';
import { PaymentWalletController } from './payment-wallet.controller';

@Module({
  controllers: [PaymentWalletController],
  imports: [
    TypeOrmModule.forFeature([PaymentWallet]),
    EthersModule,
  ],
  providers: [PaymentWalletService],
  exports: [PaymentWalletService],
})
export class PaymentWalletModule {}
