import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  ParseUUIDPipe,
  NotFoundException,
  Query,
} from '@nestjs/common';

import { EthersService } from '../../libs/ethers/ethers.service';
import { NETWORKS } from '../../common/constants';
import { PaymentWalletService } from './payment-wallet.service';
import { CreatePaymentWalletDto } from './dto/create-payment-wallet.dto';
import { UpdatePaymentWalletDto } from './dto/update-payment-wallet.dto';
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
    return { data, total, networks: NETWORKS };
  }

  @Post()
  async createWallet(@Body() body: CreatePaymentWalletDto) {
    const balance = await this.ethersService.getBalance(
      body.chainId,
      body.walletAddress,
      body.coin,
    );
    return this.service.create({ ...body, balance: Number(balance.balance) });
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
    const balance = await this.ethersService.getBalance(
      data.chainId,
      wallet.walletAddress,
      wallet.coin,
    );
    await this.service.updateById(id, {
      ...data,
      balance: Number(balance.balance),
      updatedAt: new Date(),
    });
    return wallet;
  }
}
