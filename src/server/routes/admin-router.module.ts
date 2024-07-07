import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';

import { UserModule } from '../app/users/user.module';
import { ProductModule } from '../app/products/product.module';

const routes: Routes = [
  {
    path: '/admin/api',
    children: [
      { path: '/users', module: UserModule },
      { path: '/products', module: ProductModule },
      { path: '/users', module: UserModule },
      { path: '/users', module: UserModule },
      { path: '/users', module: UserModule },
      { path: '/users', module: UserModule },
    ],
  },
];

@Module({
  imports: [RouterModule.register(routes), UserModule],
})
export class AdminRouteModule {}
