import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import slugify from 'slugify';

import { ProductService } from './product.service';
import { SearchProductDto } from './dto/search-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller()
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Get('/')
  async getList(@Query() query: SearchProductDto) {
    const [data, total] = await this.service.getAll(query);
    return {
      data,
      total,
    };
  }

  @Get(':id')
  async getDetail(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getOne({ id });
  }

  @Post()
  async create(@Body() data: CreateProductDto): Promise<Product> {
    if (!data.alias) {
      data.alias = slugify(data.name, {
        lower: true,
        replacement: '-',
      });
    }
    return this.service.create(data);
  }

  @Put(':id')
  async updateById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateProductDto,
  ) {
    const product = await this.service.getById(id);
    if (!product) {
      throw new NotFoundException('Not found product');
    }
    if (data.name && data.name !== product.name) {
      data.alias = slugify(data.name, {
        lower: true,
        replacement: '-',
      });
    }
    await this.service.updateById(id, data);
    return product;
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseUUIDPipe) id: string) {
    const product = await this.service.getById(id);
    if (!product) {
      throw new NotFoundException('Not found product');
    }
    return this.service.deleteById(id);
  }
}
