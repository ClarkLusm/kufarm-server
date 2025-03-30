import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '../../common/base/base.service';
import { UserProductStatusEnum } from '../../common/enums';
import { UserProduct } from './user-product.entity';

@Injectable()
export class UserProductService extends BaseService<UserProduct> {
  constructor(
    @InjectRepository(UserProduct)
    public repository: Repository<UserProduct>,
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
        stop: UserProductStatusEnum.Stop,
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
        stop: UserProductStatusEnum.Stop,
      })
      .orderBy('user_product.created_at', 'ASC')
      .getMany();
  }
}
