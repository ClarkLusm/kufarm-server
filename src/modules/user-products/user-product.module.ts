import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../users/user.module';
import { ProductModule } from '../products/product.module';
import { UserProductService } from './user-product.service';
import { UserProduct } from './user-product.entity';
import { UserProductController } from './user-product.controller';

@Module({
  controllers: [UserProductController],
  imports: [
    TypeOrmModule.forFeature([UserProduct]),
    ProductModule,
    forwardRef(() => UserModule),
  ],
  providers: [UserProductService],
  exports: [UserProductService],
})
export class UserProductModule {}
