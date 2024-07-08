import { Request } from 'express';
import { Controller, Get, Query } from '@nestjs/common';

import { ProductService } from '../../products/product.service';
import { UserService } from '../../users/user.service';
import { PaymentWalletService } from '../../payment-wallet/payment-wallet.service';
import { SearchReferralDto } from './dto/search-referral.dto';

@Controller('account')
export class AccountController {
  constructor(
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly paymentWalletService: PaymentWalletService,
  ) {}

  @Get('/referrals')
  async getMyReferrals(@Request() req, @Query() query: SearchReferralDto) {
    const {uid} = req.user;
    const user = await this.userService.getOne({ uid }, { id: true, referralPath: true})
    if (!user) {
      // throw new 
    }
    const offset = query.hasOwnProperty('pageSize') ? query.pageSize : 20;
    const page = query.hasOwnProperty('page') ? query.page : 1;
    const limit = (page - 1) * offset;
    const [data, total] = await this.userService.getReferralsByPath(user.referralPath, offset, limit);
    return { data, total};
  }

  @Get('/products')
  async getProducts(@Query() query: SearchReferralDto) {
    return this.productService.getAll(query);
  }

  @Get('/payments')
  async getPaymentWallets() {
    const [data, total] = await this.paymentWalletService.getAll();
    return { data, total};
  }
}