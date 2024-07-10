import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { BaseService } from 'src/server/common/base/base.service';
import { Order } from './order.entity';

@Injectable()
export class OrderService extends BaseService<Order> {
  constructor(
    @InjectRepository(Order)
    public repository: Repository<Order>,
  ) {
    super(repository);
  }
}
