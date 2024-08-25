import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Not, Repository } from 'typeorm';

import { BaseService } from '../../common/base/base.service';
import { USERPRODUCT_EXPIRED } from '../../common/constants';
import { ProductService } from '../products/product.service';
import { UserProduct } from './user-product.entity';

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
      .select(
        'user_product.product_id as "productId", COUNT(user_product.id) AS count',
      )
      .where('user_product.user_id = :userId', { userId })
      .andWhere('user_product.status != :stop', {
        stop: USERPRODUCT_EXPIRED,
      })
      .groupBy('user_product.product_id')
      .getRawMany();
    return result;
  }

  async getRunningProductsByUserId(userId: string) {
    return this.repository
      .createQueryBuilder('user_product')
      .where('user_product.user_id = :userId', { userId })
      .andWhere('user_product.income < user_product.max_out')
      .andWhere('user_product.status != :stop', {
        stop: USERPRODUCT_EXPIRED,
      })
      .orderBy('user_product.created_at', 'ASC')
      .getMany();
  }
}
