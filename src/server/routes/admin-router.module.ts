import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';

import { UserModule } from '../app/users/user.module';
import { ProductModule } from '../app/products/product.module';
import { UserTransactionModule } from '../app/user-transactions/user-transaction.module';
import { PaymentWalletModule } from '../app/payment-wallet/payment-wallet.module';
import { SettingModule } from '../app/settings/setting.module';
import { OrderModule } from '../app/orders/order.module';

const routes: Routes = [
  {
    path: '/api/admin',
    children: [
      { path: '/users', module: UserModule },
      { path: '/products', module: ProductModule },
      { path: '/transactions', module: UserTransactionModule },
      { path: '/wallets', module: PaymentWalletModule },
      { path: '/orders', module: OrderModule },
      { path: '/settings', module: SettingModule },
    ],
  },
];

@Module({
  imports: [
    RouterModule.register(routes),
    UserModule,
    ProductModule,
    UserTransactionModule,
    PaymentWalletModule,
    OrderModule,
    SettingModule,
  ],
})
export class AdminRouteModule {}
