import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserProductService } from './user-products.service';
import { UserProduct } from './user-product.entity';
import { ProductModule } from '../products/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserProduct]), ProductModule],
  providers: [UserProductService],
})
export class UserProductModule {}
