import { Body, Controller, Get, Post } from '@nestjs/common';

import { PaymentWalletService } from './payment-wallet.service';
import { CreatePaymentWalletDto } from './dto/create-payment-wallet.dto';

@Controller()
export class PaymentWalletController {
  constructor(private readonly service: PaymentWalletService) {}

  @Get('/')
  getList() {
    return this.service.find({});
  }

  @Post()
  createWallet(@Body() body: CreatePaymentWalletDto) {
    return this.service.create(body);
  }
}
