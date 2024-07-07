import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';

import { AuthModule } from '../app/api/auth/auth.module';

const routes: Routes = [
  {
    path: '/api',
    children: [
      {
        path: '/auth',
        module: AuthModule,
      },
    ],
  },
];

@Module({
  imports: [RouterModule.register(routes), AuthModule],
})
export class ClientRouteModule {}
