import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from 'src/server/common/base/base.service';
import { Order } from './order.entity';
import { buildQueryFilter } from 'src/server/common/helpers/query-builder';

@Injectable()
export class OrderService extends BaseService<Order> {
  constructor(
    @InjectRepository(Order)
    public repository: Repository<Order>,
  ) {
    super(repository);
  }

  getAll(query?: any): Promise<[Order[], number]> {
    const qr = buildQueryFilter(query);
    qr.select = {
      id: true,
      amount: true,
      quantity: true,
      coin: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      user: {
        email: true,
        walletAddress: true,
      },
      product: {
        name: true,
        price: true,
      },
    };
    qr.relations = {
      user: true,
      product: true,
    };
    return this.repository.findAndCount(qr);
  }
}
