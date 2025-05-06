import { Controller, Get, Param, Query, Req } from '@nestjs/common';

import { PaymentWalletService } from '../payment-wallets/payment-wallet.service';
import { ProductService } from '../products/product.service';
import { SettingService } from '../settings/setting.service';
import { NotifyService } from '../notify/notify.service';

@Controller()
export class PublicController {
  constructor(
    private readonly productService: ProductService,
    private readonly paymentWalletService: PaymentWalletService,
    private readonly settingService: SettingService,
    private readonly notifyService: NotifyService,
  ) {}

  @Get('/products')
  async getProducts() {
    const [data, total] = await this.productService.getAll(
      {
        published: true,
        sort: 'price',
        order: 'ASC',
      },
      {
        id: true,
        name: true,
        alias: true,
        image: true,
        price: true,
        salePrice: true,
        maxOut: true,
        hashPower: true,
        dailyIncome: true,
        monthlyIncome: true,
      },
    );
    return { data, total };
  }

  @Get('/products/:alias')
  async getProductByAlias(@Param('alias') alias: string) {
    const data = await this.productService.getOne(
      {
        published: true,
        alias,
      },
      {
        id: true,
        name: true,
        image: true,
        price: true,
        salePrice: true,
        maxOut: true,
        hashPower: true,
        dailyIncome: true,
        monthlyIncome: true,
      },
    );
    return data;
  }

  @Get('/payments')
  getPaymentWallets() {
    return this.paymentWalletService.find({
      where: {
        published: true,
        isOut: false,
      },
      select: {
        id: true,
        name: true,
        image: true,
        coin: true,
        chainId: true,
      },
    });
  }

  @Get('/app-settings')
  getAppSettings() {
    return this.settingService.getAppSettings();
  }

  @Get('/reinvest-settings')
  getReinvestSettings() {
    return this.settingService.getReinvestSettings();
  }

  @Get('/app-notify')
  getAppNotify(@Query() query) {
    return this.notifyService.getAppNotify({
      access: query.user_logged == 1 ? 'user' : 'guest',
    });
  }
}
