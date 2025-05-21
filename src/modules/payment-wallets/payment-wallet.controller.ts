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
  Delete,
} from '@nestjs/common';

import { encryptedWalletKey } from '../../utils';
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
    const [rows, total] = await this.service.getAll(query);
    const data = rows.map((row) => ({
      ...row,
      secret: row.secret ? '**********' : null,
    }));
    return { data, total, networks: NETWORKS };
  }

  @Post()
  async createWallet(@Body() body: CreatePaymentWalletDto) {
    const balance = await this.ethersService.getBalance(
      body.chainId,
      body.walletAddress,
      body.coin,
    );
    if (body.secret) {
      let ivRaw: string;
      [body.secret, ivRaw] = encryptedWalletKey(body.secret);
      body['iv'] = ivRaw;
    }
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
      data.chainId || wallet.chainId,
      data.walletAddress || wallet.walletAddress,
      data.coin || wallet.coin,
    );
    if (
      data.secret &&
      data.secret != wallet.secret &&
      !data.secret.includes('*')
    ) {
      let ivRaw: string;
      [data.secret, ivRaw] = encryptedWalletKey(data.secret);
      data['iv'] = ivRaw;
    } else {
      delete data.secret;
    }
    await this.service.updateById(id, {
      ...data,
      balance: Number(balance.balance),
      updatedAt: new Date(),
    });
    return wallet;
  }

  @Delete(':id')
  async deleteWallet(@Param('id', ParseUUIDPipe) id: string) {
    const wallet = await this.service.getById(id);
    if (!wallet) {
      throw new NotFoundException('Not found the wallet');
    }
    await this.service.deleteById(id);
  }
}
