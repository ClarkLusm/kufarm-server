import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '../../common/base/base.service';
import { Product } from './product.entity';

@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(
    @InjectRepository(Product)
    public repository: Repository<Product>,
  ) {
    super(repository);
  }
}
