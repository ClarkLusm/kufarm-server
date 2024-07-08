import { Controller, Get, Query, Req } from '@nestjs/common';

import { UserService } from '../../users/user.service';
import { ProductService } from '../../products/product.service';
import { PaymentWalletService } from '../../payment-wallet/payment-wallet.service';
import { UserProductService } from '../../user-products/user-product.service';
import { SearchReferralDto } from './dto/search-referral.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { In } from 'typeorm';

@Controller('account')
export class AccountController {
  constructor(
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly userProductService: UserProductService,
    private readonly paymentWalletService: PaymentWalletService,
  ) {}

  @Get('/referrals')
  async getMyReferrals(@Req() req, @Query() query: SearchReferralDto) {
    const { sub } = req.user;
    const user = await this.userService.getOne(
      { uid: sub },
      { id: true, referralPath: true },
    );
    const offset = query.hasOwnProperty('pageSize') ? query.pageSize : 20;
    const page = query.hasOwnProperty('page') ? query.page : 1;
    const limit = (page - 1) * offset;
    const [data, total] = await this.userService.getReferralsByPath(
      user.referralPath,
      offset,
      limit,
    );
    return { data, total };
  }

  @Get('/products')
  async getProducts(@Query() query: SearchProductDto) {
    return this.productService.getAll(query);
  }

  @Get('/my-products')
  async getMyProducts(@Req() req, @Query() query: SearchReferralDto) {
    const { sub } = req.user;
    const user = await this.userService.getOne({ uid: sub }, { id: true });
    const userProducts = await this.userProductService.countProductByUserId(user.id);
    const [data, total] = await this.productService.getAll();
    return { data, total, userProducts };
  }

  @Get('/payments')
  async getPaymentWallets() {
    const [data, total] = await this.paymentWalletService.getAll();
    return { data, total };
  }
}
