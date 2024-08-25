import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtAdminAuthModule } from '../admin-auth/jwt/jwt-auth.module';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  controllers: [OrderController],
  imports: [TypeOrmModule.forFeature([Order]), JwtAdminAuthModule],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
