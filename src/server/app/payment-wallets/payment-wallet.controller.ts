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

  @Get('/supported-networks')
  async getSupportedNetworks() {
    return NETWORKS;
  }
}
