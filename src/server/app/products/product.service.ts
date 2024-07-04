import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  create(user: CreateProductDto) {
    return this.productRepository.save(user);
  }

  findOne(params: FindOneOptions<Product> = {}) {
    return this.productRepository.findOne(params);
  }

  findAll(params: FindManyOptions<Product> = {}) {
    return this.productRepository.find(params);
  }
}
