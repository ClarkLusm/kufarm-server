import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';

import { AuthModule } from '../modules/auth/auth.module';
import { AccountModule } from '../modules/accounts/account.module';

const routes: Routes = [
  {
    path: '/api',
    children: [
      {
        path: '/auth',
        module: AuthModule,
      },
      {
        path: '/account',
        module: AccountModule,
      },
    ],
  },
];

@Module({
  imports: [RouterModule.register(routes), AuthModule, AccountModule],
})
export class ClientRouteModule {}
