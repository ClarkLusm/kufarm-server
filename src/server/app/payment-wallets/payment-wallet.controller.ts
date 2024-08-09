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
  ) {
    // 5d6c8322ad8edff07cc2294e68ed32a6f14a4b2c97aa8f3ea9457202cfd3e245
    // this.ethersService.sendBTCO2Token(
    //   '5d6c8322ad8edff07cc2294e68ed32a6f14a4b2c97aa8f3ea9457202cfd3e245',
    //   '0x807974B411B6b2277d73d3D017f5749Fb7bD5E62',
    //   '10',
    // );
    this.ethersService.subBalanceChange(
      '0x0b37D0D50528995072ceaDC303C352F3b75f39A6',
      () => {},
    );
  }

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
