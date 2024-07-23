import { Module } from '@nestjs/common';

import { PaymentWalletModule } from '../payment-wallet/payment-wallet.module';
import { ProductModule } from '../products/product.module';
import { PublicController } from './public.controller';

@Module({
  controllers: [PublicController],
  imports: [PaymentWalletModule, ProductModule],
})
export class PublicModule {}
