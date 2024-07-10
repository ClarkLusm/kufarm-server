import { Controller, Get, Query, Req } from '@nestjs/common';

import { TransactionEnum } from '../../../common/enums';
import { UserService } from '../../users/user.service';
import { ProductService } from '../../products/product.service';
import { PaymentWalletService } from '../../payment-wallet/payment-wallet.service';
import { UserProductService } from '../../user-products/user-product.service';
import { UserTransactionService } from '../../user-transactions/user-transaction.service';
import { OrderService } from '../../orders/order.service';
import { SearchReferralDto } from './dto/search-referral.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { SearchOrderDto } from './dto/search-order.dto';
import { SearchWithdrawHistoryDto } from './dto/search-transaction.dto';

@Controller('account')
export class AccountController {
  constructor(
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly userProductService: UserProductService,
    private readonly paymentWalletService: PaymentWalletService,
    private readonly orderService: OrderService,
    private readonly userTransactionService: UserTransactionService,
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
  async getMyProducts(@Req() req) {
    const { sub } = req.user;
    const user = await this.userService.getOne({ uid: sub }, { id: true });
    const userProducts = await this.userProductService.getProductByUserId(
      user.id,
    );
    const [data, total] = await this.productService.getAll();
    return { data, total, userProducts };
  }

  @Get('/payments')
  async getPaymentWallets() {
    const [data, total] = await this.paymentWalletService.getAll();
    return { data, total };
  }

  @Get('/mining')
  async getMyMining(@Req() req) {
    const { sub } = req.user;
    const user = await this.userService.getOne({ uid: sub });
    const userProducts = await this.userProductService.getProductByUserId(
      user.id,
    );
    return {
      pool: 'stratum+tcp://sha256d.kupool.com:443',
      balance: user.balance,
      username: user.username,
      wallet: user.btcAddress,
      referralBalance: user.referralBalance,
      dailyIncome: userProducts.reduce((a, b) => a + b.dailyIncome, 0),
      monthlyIncome: userProducts.reduce((a, b) => a + b.monthlyIncome, 0),
    };
  }

  @Get('/orders')
  async getOrderHistory(@Req() req, @Query() query: SearchOrderDto) {
    const { sub } = req.user;
    const user = await this.userService.getOne({ uid: sub }, { id: true });
    const [data, total] = await this.orderService.getAll({
      ...query,
      userId: user.id,
    });
    return { data, total };
  }

  @Get('/withdraws')
  async getWithdrawHistory(
    @Req() req,
    @Query() query: SearchWithdrawHistoryDto,
  ) {
    const { sub } = req.user;
    const user = await this.userService.getOne({ uid: sub }, { id: true });
    const [data, total] = await this.userTransactionService.getAll({
      ...query,
      userId: user.id,
      type: TransactionEnum.withdraw,
    });
    return { data, total };
  }
}
