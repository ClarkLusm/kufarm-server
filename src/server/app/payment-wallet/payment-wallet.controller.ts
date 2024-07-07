import { Controller, Get } from '@nestjs/common';
import { PaymentWalletService } from './payment-wallet.service';


@Controller()
export class PaymentWalletController {
  constructor(private readonly service: PaymentWalletService) {}

  @Get('/')
  getList() {
    return this.service.find({});
  }
}
