import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';

import { UserModule } from '../modules/users/user.module';
import { ProductModule } from '../modules/products/product.module';
import { TransactionModule } from '../modules/transactions/transaction.module';
import { PaymentWalletModule } from '../modules/payment-wallets/payment-wallet.module';
import { SettingModule } from '../modules/settings/setting.module';
import { OrderModule } from '../modules/orders/order.module';
import { AdminAuthModule } from '../modules/admin-auth/admin-auth.module';
import { NotifyModule } from '../modules/notify/notify.module';

const routes: Routes = [
  {
    path: '/api/admin',
    children: [
      { path: '/users', module: UserModule },
      { path: '/products', module: ProductModule },
      { path: '/transactions', module: TransactionModule },
      { path: '/wallets', module: PaymentWalletModule },
      { path: '/orders', module: OrderModule },
      { path: '/settings', module: SettingModule },
      { path: '/notifies', module: NotifyModule },
      { path: '/', module: AdminAuthModule },
    ],
  },
];

@Module({
  imports: [
    RouterModule.register(routes),
    UserModule,
    ProductModule,
    TransactionModule,
    PaymentWalletModule,
    OrderModule,
    SettingModule,
    AdminAuthModule,
  ],
})
export class AdminRouteModule {}
