import { Controller, Get } from '@nestjs/common';
import { UserTransactionService } from './user-transaction.service';


@Controller()
export class UserTransactionController {
  constructor(private readonly service: UserTransactionService) {}

  @Get('/')
  getList() {
    return this.service.find({});
  }
}
