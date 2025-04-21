import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { BaseService } from '../../common/base/base.service';
import { UserProductStatusEnum } from '../../common/enums';
import { UserProduct } from './user-product.entity';
import { UpdateUserProductsDto } from './dto/update-user-products.dto';
import { User } from '../users/user.entity';

@Injectable()
export class UserProductService extends BaseService<UserProduct> {
  constructor(
    @InjectRepository(UserProduct)
    public repository: Repository<UserProduct>,
    private readonly dataSource: DataSource,
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

  async getRunningProductsByUserId(
    userId: string,
    customHashPower?: boolean,
    createdAt?: Date,
  ) {
    const query = this.repository.createQueryBuilder('user_product');
    if (!customHashPower) {
      query
        .leftJoinAndSelect('user_product.product', 'product')
        .select([
          'user_product',
          'product.hashPower',
          'product.dailyIncome',
          'product.monthlyIncome',
        ]);
    }
    query
      .where('user_product.user_id = :userId', { userId })
      .andWhere('user_product.income < user_product.max_out')
      .andWhere('user_product.status != :stop', {
        stop: UserProductStatusEnum.Stop,
      });

    if (createdAt) {
      query.andWhere('user_product.created_at < :createdAt', {
        createdAt,
      });
    }

    return query.orderBy('user_product.created_at', 'ASC').getMany();
  }

  async updateUserProducts(userId: string, data: UpdateUserProductsDto) {
    await this.dataSource.transaction(async (tx) => {
      await tx
        .getRepository(User)
        .update({ id: userId }, { customHashPower: data.customHashPower });
      if (data.customHashPower && data.userProducts.length) {
        data.userProducts.forEach(async (up) => {
          await tx.getRepository(UserProduct).update(
            {
              userId,
              productId: up.productId,
              status: UserProductStatusEnum.Activated,
            },
            {
              hashPower: up.hashPower,
              dailyIncome: up.dailyIncome,
              monthlyIncome: up.monthlyIncome,
            },
          );
        });
      }
    });
  }

  async getProductUserProducts(userId: string) {
    return this.repository
      .createQueryBuilder('user_product')
      .leftJoinAndSelect('user_product.product', 'product')
      .select([
        'user_product',
        'product.name',
        'product.hashPower',
        'product.dailyIncome',
        'product.monthlyIncome',
      ])
      .where('user_product.user_id = :userId', { userId })
      .andWhere('user_product.status != :stop', {
        stop: UserProductStatusEnum.Stop,
      })
      .orderBy('user_product.created_at', 'DESC')
      .getMany();
  }
}
