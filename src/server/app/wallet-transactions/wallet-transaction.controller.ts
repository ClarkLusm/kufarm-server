import { Controller, Get } from '@nestjs/common';
import { WalletTransactionService } from './wallet-transaction.service';


@Controller()
export class WalletTransactionController {
  constructor(private readonly service: WalletTransactionService) {}

  @Get('/')
  getList() {
    return this.service.find({});
  }
}
