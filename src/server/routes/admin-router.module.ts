import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';

import { UserModule } from '../app/users/user.module';
import { ProductModule } from '../app/products/product.module';
import { TransactionModule } from '../app/transactions/transaction.module';
import { PaymentWalletModule } from '../app/payment-wallet/payment-wallet.module';
import { SettingModule } from '../app/settings/setting.module';
import { OrderModule } from '../app/orders/order.module';
import { AdminAuthModule } from '../app/admin-auth/admin-auth.module';

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
