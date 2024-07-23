import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  ParseUUIDPipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PaymentWalletService } from './payment-wallet.service';
import { CreatePaymentWalletDto } from './dto/create-payment-wallet.dto';
import { UpdatePaymentWalletDto } from './dto/update-payment-wallet.dto';
import { CreatePaymentAccountDto } from './dto/create-payment-account.dto';
import { EthersService } from 'src/server/libs/ethers/ethers.service';

@Controller()
export class PaymentWalletController {
  constructor(
    private readonly service: PaymentWalletService,
    private readonly ethersService: EthersService,
  ) {}

  @Get('/')
  getList() {
    return this.service.find({});
  }

  @Post()
  createWallet(@Body() body: CreatePaymentWalletDto) {
    return this.service.create(body);
  }

  @Put(':id')
  async updateById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdatePaymentWalletDto,
  ) {
    const wallet = await this.service.getById(id);
    if (!wallet) {
      throw new NotFoundException('Not found wallet');
    }
    await this.service.updateById(id, data);
    return wallet;
  }

  @Post('/accounts')
  async createPaymentAccount(@Body() body: CreatePaymentAccountDto) {
    const wallet = await this.service.getById(body.paymentWalletId);
    if (!wallet) {
      throw new BadRequestException('Payment wallet invalid');
    }
    const accountBalance = await this.ethersService.getAccountBalance(
      wallet.chainId,
      body.accountAddress,
    );
    const data = { ...body, balance: Number(accountBalance) };
    return this.service.createAccount(data);
  }
}
