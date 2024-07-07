import { Controller, Get } from '@nestjs/common';

import { UserProductService } from './user-product.service';

@Controller()
export class UserProductController {
  constructor(private readonly service: UserProductService) {}

  @Get('/')
  getList() {
    return this.service.find({});
  }
}
