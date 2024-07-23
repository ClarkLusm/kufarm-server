import { Controller, Get } from '@nestjs/common';

import { PaymentWalletService } from '../payment-wallet/payment-wallet.service';
import { ProductService } from '../products/product.service';

@Controller()
export class PublicController {
  constructor(
    private readonly productService: ProductService,
    private readonly paymentWalletService: PaymentWalletService,
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

  @Get('/payments')
  async getPaymentWallets() {
    const [data, total] = await this.paymentWalletService.getAll(
      {
        published: true,
        isOut: false,
      },
      {
        id: true,
        name: true,
        image: true,
      },
    );
    return { data, total };
  }
}
