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
  Query,
} from '@nestjs/common';

import { PaymentWalletService } from './payment-wallet.service';
import { CreatePaymentWalletDto } from './dto/create-payment-wallet.dto';
import { UpdatePaymentWalletDto } from './dto/update-payment-wallet.dto';
import { CreatePaymentAccountDto } from './dto/create-payment-account.dto';
import { EthersService } from 'src/server/libs/ethers/ethers.service';
import { buildQueryFilter } from 'src/server/common/helpers/query-builder';
import { SearchPaymentWalletDto } from './dto/search-payment-wallet.dto';

@Controller()
export class PaymentWalletController {
  constructor(
    private readonly service: PaymentWalletService,
    private readonly ethersService: EthersService,
  ) {}

  @Get('/')
  async getList(@Query() query: SearchPaymentWalletDto) {
    const [data, total] = await this.service.getAll(query);
    return { data, total };
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

  @Post('/:walletId/accounts')
  async createPaymentAccount(
    @Param('walletId') walletId: ParseUUIDPipe,
    @Body() body: CreatePaymentAccountDto,
  ) {
    const wallet = await this.service.getById(walletId);
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

  @Get('/:walletId/accounts')
  async getPaymentAccount(
    @Param('walletId', ParseUUIDPipe) walletId: string,
    @Query() query: SearchPaymentWalletDto,
  ) {
    const wallet = await this.service.getById(walletId);
    if (!wallet) {
      throw new BadRequestException('Payment wallet invalid');
    }
    const qr = buildQueryFilter({ ...query, paymentWalletId: walletId });
    const [data, total] = await this.service.getAndCountAccounts(qr);
    return { data, total };
  }
}
