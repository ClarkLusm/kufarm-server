import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from 'src/server/common/base/base.service';
import { UserProduct } from './user-product.entity';
import { ProductService } from '../products/product.service';
import { USERPRODUCT_EXPIRED } from 'src/server/common/constants';

@Injectable()
export class UserProductService extends BaseService<UserProduct> {
  constructor(
    @InjectRepository(UserProduct)
    public repository: Repository<UserProduct>,
    @Inject(ProductService) private productService: ProductService,
  ) {
    super(repository);
  }

  async countProductByUserId(userId: number) {
    const result = await this.repository
      .createQueryBuilder('user_product')
      .select('user_product.product_id, COUNT(user_product.id) AS count')
      .where('user_product.user_id = :userId', { userId })
      .andWhere('user_product.end_at > :now', { now: new Date().toISOString() })
      .andWhere('user_product.status != :expired', { stop: USERPRODUCT_EXPIRED })
      .groupBy('user_product.product_id')
      .getRawMany();
    return result;
  }
}
