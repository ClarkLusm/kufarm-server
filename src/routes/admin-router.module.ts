import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';

import { UserModule } from '../modules/users/user.module';
import { OrderModule } from '../modules/orders/order.module';
import { NotifyModule } from '../modules/notify/notify.module';
import { SettingModule } from '../modules/settings/setting.module';
import { ProductModule } from '../modules/products/product.module';
import { AdminAuthModule } from '../modules/admin-auth/admin-auth.module';
import { TransactionModule } from '../modules/transactions/transaction.module';
import { UserProductModule } from '../modules/user-products/user-product.module';
import { PaymentWalletModule } from '../modules/payment-wallets/payment-wallet.module';

const routes: Routes = [
  {
    path: '/api/admin',
    children: [
      { path: '/users', module: UserModule },
      { path: '/products', module: ProductModule },
      { path: '/user-products', module: UserProductModule },
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
