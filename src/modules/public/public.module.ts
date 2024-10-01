import { Module } from '@nestjs/common';

import { PaymentWalletModule } from '../payment-wallets/payment-wallet.module';
import { ProductModule } from '../products/product.module';
import { SettingModule } from '../settings/setting.module';
import { PublicController } from './public.controller';
import { NotifyModule } from '../notify/notify.module';

@Module({
  controllers: [PublicController],
  imports: [PaymentWalletModule, ProductModule, SettingModule, NotifyModule],
})
export class PublicModule {}
