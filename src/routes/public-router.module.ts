import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';

import { PublicModule } from '../modules/public/public.module';

const routes: Routes = [
  {
    path: '/api',
    module: PublicModule,
  },
];

@Module({
  imports: [RouterModule.register(routes), PublicModule],
})
export class PublicRouteModule {}
