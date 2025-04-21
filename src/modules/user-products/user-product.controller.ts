import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';

import { UserService } from '../users/user.service';
import { UserProductService } from './user-product.service';
import { UpdateUserProductsDto } from './dto/update-user-products.dto';

@Controller()
export class UserProductController {
  constructor(
    private readonly service: UserProductService,
    private readonly userService: UserService,
  ) {}

  @Get('/user/:userId')
  async getListByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    const user = await this.userService.getById(userId);
    if (!user) {
      throw new NotFoundException('Not found user');
    }
    const userProducts = await this.service.getProductUserProducts(userId);
    return {
      customHashPower: user.customHashPower,
      userProducts,
    };
  }

  @Put('/user/:userId')
  async customHashPower(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() data: UpdateUserProductsDto,
  ) {
    try {
      const user = await this.service.getById(userId);
      if (!user) {
        throw new NotFoundException('Not found user');
      }
      await this.userService.syncBalance(userId);
      return await this.service.updateUserProducts(userId, data);
    } catch (error) {
      throw new BadRequestException(error?.message ?? '');
    }
  }
}
