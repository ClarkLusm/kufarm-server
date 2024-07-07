import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentWallet } from './payment-wallet.entity';
import { PaymentWalletService } from './payment-wallet.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentWallet])],
  providers: [PaymentWalletService],
  exports: [PaymentWalletService],
})
export class PaymentWalletModule {}
