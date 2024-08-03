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
import { plainToInstance } from 'class-transformer';

import { EthersService } from '../../libs/ethers/ethers.service';
import { buildQueryFilter } from '../../common/helpers/query-builder';
import { NETWORKS } from '../../common/constants';
import { PaymentWalletService } from './payment-wallet.service';
import { CreatePaymentWalletDto } from './dto/create-payment-wallet.dto';
import { UpdatePaymentWalletDto } from './dto/update-payment-wallet.dto';
import { CreatePaymentAccountDto } from './dto/create-payment-account.dto';
import { SearchPaymentWalletDto } from './dto/search-payment-wallet.dto';
import { PaymentWallet } from './payment-wallet.entity';

@Controller()
export class PaymentWalletController {
  constructor(
    private readonly service: PaymentWalletService,
    private readonly ethersService: EthersService,
  ) {
    // 5d6c8322ad8edff07cc2294e68ed32a6f14a4b2c97aa8f3ea9457202cfd3e245
    // this.ethersService.sendBTCO2Token(
    //   '5d6c8322ad8edff07cc2294e68ed32a6f14a4b2c97aa8f3ea9457202cfd3e245',
    //   '0x807974B411B6b2277d73d3D017f5749Fb7bD5E62',
    //   '10',
    // );
    this.ethersService.subBalanceChange(
      '0x0b37D0D50528995072ceaDC303C352F3b75f39A6',
      () => {}
    );
  }

  @Get('/')
  async getList(@Query() query: SearchPaymentWalletDto) {
    const [data, total] = await this.service.getAll(query);
    return { data, total };
  }

  @Post()
  createWallet(@Body() body: CreatePaymentWalletDto) {
    return this.service.createWallet(plainToInstance(PaymentWallet, body));
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
    const accountBalance = await this.ethersService.getBalance(
      body.accountAddress,
      wallet.coin,
    );
    const data = { ...body, balance: Number(accountBalance.formattedBalance) };
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

  @Get('/supported-networks')
  async getSupportedNetworks() {
    return NETWORKS;
  }
}
