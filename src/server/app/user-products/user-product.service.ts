import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateUserProductDto } from './dto/create-user-product.dto';
import { ProductService } from '../products/product.service';
import { UserProduct } from './user-product.entity';

@Injectable()
export class UserProductService {
  constructor(
    @InjectRepository(UserProduct)
    private userProductRepository: Repository<UserProduct>,
    @Inject(ProductService) private productService: ProductService,
  ) {}

}
