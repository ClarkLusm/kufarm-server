import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';
import { ProductHelper } from './product.helper';
import { BaseService } from 'src/server/common/base/base.service';

@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(
    @InjectRepository(Product)
    public repository: Repository<Product>,
  ) {
    super(repository);
  }
}
