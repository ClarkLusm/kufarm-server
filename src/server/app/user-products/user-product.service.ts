import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateUserProductDto } from './dto/create-user-product.dto';

import { BaseService } from 'src/server/common/base/base.service';
import { UserProduct } from './user-product.entity';
import { ProductService } from '../products/product.service';

@Injectable()
export class UserProductService extends BaseService<UserProduct> {
  constructor(
    @InjectRepository(UserProduct)
    public repository: Repository<UserProduct>,
    @Inject(ProductService) private productService: ProductService,
  ) {
    super(repository);
  }
}
