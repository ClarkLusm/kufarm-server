import { DataSource, MoreThan } from 'typeorm';
import moment from 'moment';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
} from '@nestjs/common';

import { EthersService } from 'src/server/libs/ethers/ethers.service';
import { OrderStatusEnum } from 'src/server/common/enums';
import { UserProductStatusEnum } from 'src/server/common/enums/user-product.enum';
import { PaymentWalletService } from '../../payment-wallet/payment-wallet.service';
import { UserProductService } from '../../user-products/user-product.service';
import { TransactionService } from '../../transactions/transaction.service';
import { UserProduct } from '../../user-products/user-product.entity';
import { ProductService } from '../../products/product.service';
import { OrderService } from '../../orders/order.service';
import { UserService } from '../../users/user.service';
import { Order } from '../../orders/order.entity';
import { User } from '../../users/user.entity';
import { SearchWithdrawHistoryDto } from './dto/search-transaction.dto';
import { SearchReferralDto } from './dto/search-referral.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { SearchOrderDto } from './dto/search-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { RequestWithdrawDto } from './dto/request-withdraw.dto';

@Controller()
export class AccountController {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly userProductService: UserProductService,
    private readonly paymentWalletService: PaymentWalletService,
    private readonly transactionService: TransactionService,
    private readonly orderService: OrderService,
    private readonly ethersServive: EthersService,
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
    const userProducts = await this.userProductService.countProductByUserId(
      user.sid,
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
    const miningInfo = await this.userService.syncBalance(sub);
    const user = await this.userService.getOne({ uid: sub });
    return {
      pool: 'stratum+tcp://sha256d.kupool.com:443',
      balance: user.balance,
      username: user.username,
      wallet: user.walletAddress,
      referralCommission: user.referralCommission,
      ...miningInfo,
    };
  }

  @Get('/my-orders')
  async getOrderHistory(@Req() req, @Query() query: SearchOrderDto) {
    const { sub } = req.user;
    const user = await this.userService.getOne({ uid: sub }, { id: true });
    const [data, total] = await this.orderService.getAll({
      ...query,
      userId: user.id,
    });
    return { data, total };
  }

  @Get('/my-withdraws')
  async getWithdrawHistory(
    @Req() req,
    @Query() query: SearchWithdrawHistoryDto,
  ) {
    const { sub } = req.user;
    const user = await this.userService.getOne({ uid: sub }, { id: true });
    const [data, total] = await this.transactionService.getAll({
      ...query,
      userId: user.id,
    });
    return { data, total };
  }

  @Post('/order')
  async createNewOrder(@Req() req, @Body() body: CreateOrderDto) {
    const { sub } = req.user;
    const { productId, walletId, quantity } = body;

    const product = await this.productService.getById(productId);
    if (!product || !product?.published) {
      throw new BadRequestException('Product invalid');
    }

    const wallet = await this.paymentWalletService.getById(walletId);
    if (!wallet || !wallet?.published) {
      throw new BadRequestException('Payment method invalid');
    }

    const user = await this.userService.getById(sub);
    if (!user || !user?.bannedAt) {
      throw new BadRequestException('User invalid');
    }

    // Find a pending order
    let order = await this.orderService.findOneBy({
      userId: sub,
      productId,
      status: OrderStatusEnum.Pending,
      expiredAt: MoreThan(new Date()),
    });

    // Create new order
    if (!order) {
      const walletAddress = await this.paymentWalletService.getAvaiableAccount(
        wallet,
      );
      order = await this.orderService.create({
        code: `${user.sid}${moment().format('YYMMDDHHmmss')}`,
        walletAddress,
        userId: sub,
        productId,
        quantity,
        amount: product.price * quantity,
        coin: wallet.coin,
        expiredAt: moment().add(15, 'minutes').format(),
      });
    }

    this.ethersServive.onBalanceChange(
      wallet.id,
      order.walletAddress,
      async () => {
        // Sync before add new user-product
        await this.userService.syncBalance(sub);
        // TODO: push event to FE
        this.dataSource.transaction(async (tx) => {
          await tx.getRepository(Order).update(order.id, {
            status: OrderStatusEnum.Success,
          });
          await tx.getRepository(UserProduct).create({
            userId: sub,
            productId,
            maxOut: product.maxOut,
            hashPower: product.hashPower,
            dailyIncome: product.dailyIncome,
            monthlyIncome: product.monthlyIncome,
            status: UserProductStatusEnum.Activated,
          });
          await tx.getRepository(User).update(sub, {
            maxOut: user.maxOut + product.maxOut,
          });
        });
      },
    );

    return order;
  }

  @Post('/withdraw')
  async withdraw(@Req() req, @Body() body: RequestWithdrawDto) {
    try {
      const { sub } = req.user;
      const { coin, amount } = body;
      return this.transactionService.withdraw(sub, coin, amount);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('/verify-account')
  async verifyAccount(@Body() body: VerifyAccountDto) {
    const { email, token } = body;
    // TODO: Check token has expired
    const user = await this.userService.getOne({
      email,
    });
    if (!user) {
      throw new BadRequestException('Invalid information');
    }
    if (user.emailVerified) {
      throw new BadRequestException('Account has verified already');
    }
    await this.userService.updateById(user.id, { emailVerified: true });
  }
}
