import { DataSource, MoreThan } from 'typeorm';
import moment from 'moment';
import {
  BadRequestException,
  NotFoundException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { EthersService } from '../../libs/ethers/ethers.service';
import { OrderStatusEnum, TransactStatusEnum } from '../../common/enums';
import { UserProductStatusEnum } from '../../common/enums/user-product.enum';
import { PaymentWalletService } from '../payment-wallets/payment-wallet.service';
import { UserProductService } from '../user-products/user-product.service';
import { TransactionService } from '../transactions/transaction.service';
import { UserProduct } from '../user-products/user-product.entity';
import { ProductService } from '../products/product.service';
import { OrderService } from '../orders/order.service';
import { UserService } from '../users/user.service';
import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { TOKENS } from '../../common/constants';
import { numberToBigInt } from '../../common/helpers/number.utils';
import { SettingService } from '../settings/setting.service';
import { Transaction } from '../transactions/transaction.entity';
import { ReferralCommissionService } from '../referral-commissions/referral-commission.service';
import {
  CreateOrderDto,
  RequestWithdrawDto,
  SearchOrderDto,
  SearchReferralDto,
  VerifyAccountDto,
} from './dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly userProductService: UserProductService,
    private readonly paymentWalletService: PaymentWalletService,
    private readonly transactionService: TransactionService,
    private readonly orderService: OrderService,
    private readonly settingService: SettingService,
    private readonly referralCommissionService: ReferralCommissionService,
    private readonly ethersService: EthersService,
  ) {}

  @Get('/referrals')
  async getMyReferrals(@Req() req, @Query() query: SearchReferralDto) {
    const { sub } = req.user;
    const user = await this.userService.getOne(
      { id: sub },
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

  @Get('/my-products')
  async getMyProducts(@Req() req) {
    const { sub } = req.user,
      userProducts = await this.userProductService.countProductByUserId(sub);
    const [data, total] = await this.productService.getAll(
      {
        published: true,
      },
      {
        id: true,
        name: true,
        alias: true,
        image: true,
      },
    );
    return { data, total, userProducts };
  }

  @Get('/profile')
  async getMyMining(@Req() req) {
    const { sub } = req.user;
    const miningInfo = await this.userService.syncBalance(sub);
    const user = await this.userService.getById(sub);
    const [balanceToken] = await this.settingService.convertUsdToBTCO2(
      user.balance,
    );
    return {
      pool: 'stratum+tcp://sha256d.kupool.com:443',
      balance: user.balance,
      balanceToken,
      username: user.username,
      email: user.email,
      walletAddress: user.walletAddress,
      referralCommission: user.referralCommission,
      ...miningInfo,
    };
  }

  @Get('/my-orders')
  async getOrderHistory(@Req() req, @Query() query: SearchOrderDto) {
    const { sub } = req.user;
    const [data, total] = await this.orderService.getAll({
      ...query,
      userId: sub,
    });
    return { data, total };
  }

  @Get('/withdraws')
  async getWithdrawHistory(@Req() req) {
    const { sub } = req.user;
    const [data, total] = await this.transactionService.getAll(
      {
        userId: sub,
      },
      {
        userAddress: true,
        coin: true,
        amount: true,
        txHash: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    );
    return { data, total };
  }

  @Post('/order')
  async createNewOrder(@Req() req, @Body() body: CreateOrderDto) {
    const { sub } = req.user;
    const { productId, paymentWalletId, quantity } = body;

    const product = await this.productService.getById(productId);
    if (!product || !product?.published) {
      throw new BadRequestException('Product invalid');
    }

    const wallet = await this.paymentWalletService.getById(paymentWalletId);
    if (!wallet || !wallet?.published) {
      throw new BadRequestException('Payment wallet invalid');
    }

    const user = await this.userService.getById(sub);
    if (!user || user?.bannedAt) {
      throw new BadRequestException('User invalid');
    }

    // Find a pending order
    let order = await this.orderService.findOneBy({
      userId: sub,
      productId,
      quantity,
      status: OrderStatusEnum.Pending,
      expiredAt: MoreThan(new Date()),
    });

    // Create new order
    if (!order) {
      const walletAddress = await this.paymentWalletService.getAvaiableAccount(
        wallet,
      );

      const orderPrice = product.price * quantity;
      let priceBigint = orderPrice * Math.pow(10, TOKENS.USDT.decimal);

      if (wallet.coin === TOKENS.BTCO2.symbol) {
        const [btco2Amount] = await this.settingService.convertUsdToBTCO2(
          orderPrice,
        );
        priceBigint = btco2Amount;
      }

      order = await this.orderService.create({
        code: `${user.sid}${moment().format('YYMMDDHHmmss')}`,
        walletAddress,
        userId: sub,
        productId,
        quantity,
        amount: priceBigint,
        coin: wallet.coin,
        expiredAt: moment().add(15, 'minutes').format(),
      });
    }

    this.ethersService.subBalanceChange(order.walletAddress, async (res) => {
      //Just update transaciton when amount equal
      if (
        res.address === order.walletAddress
        //  &&
        // BigInt(order.amount) === res.amount
      ) {
        // Sync before add new user-product
        await this.userService.syncBalance(sub);
        // TODO: push event to FE
        this.dataSource.transaction(async (tx) => {
          await tx.getRepository(Order).update(order.id, {
            status: OrderStatusEnum.Success,
          });
          await tx.getRepository(UserProduct).save({
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
      }
    });

    return order;
  }

  @Post('/withdraw')
  async withdraw(@Req() req, @Body() body: RequestWithdrawDto) {
    try {
      const { sub } = req.user;
      const { amount } = body;
      const { balance: userBalance } = await this.userService.syncBalance(sub);
      const user = await this.userService.getById(sub);

      const amountBigInt = numberToBigInt(amount, TOKENS.BTCO2.decimal);
      const [tokenBalance, rate] = await this.settingService.convertUsdToBTCO2(
        userBalance,
      );
      if (tokenBalance < amountBigInt) {
        throw new Error('Your balance is not enough');
      }

      const accountPayout = await this.paymentWalletService.getAccountPayout(
        amountBigInt,
      );
      if (!accountPayout) {
        throw new Error('The system is busy');
      }

      const amountUsd = amount * rate;
      const transaction = await this.transactionService.create({
        userId: user.id,
        paymentWalletId: accountPayout.paymentWalletId,
        paymentAccountId: accountPayout.id,
        userAddress: user.walletAddress,
        walletBalance: accountPayout.balance,
        amount: amountBigInt,
        amountUsd,
        exchangeRate: rate,
        coin: TOKENS.BTCO2.symbol,
        status: TransactStatusEnum.Pending,
      });

      try {
        const txHash = await this.ethersService.sendBTCO2Token(
          accountPayout.paymentWallet.secret,
          user.walletAddress,
          amount.toString(),
        );
        // fetch account balance again
        const accountBalance =
          await this.paymentWalletService.syncAccountBalance(
            accountPayout.id,
            accountPayout.accountAddress,
            accountPayout.paymentWallet.coin,
          );

        await this.dataSource.transaction(async (tx) => {
          await tx.getRepository(User).update(user.id, {
            balance: userBalance - amountUsd,
          });
          await tx.getRepository(Transaction).update(transaction.id, {
            status: TransactStatusEnum.Success,
            txHash: txHash.hash,
            walletBalance: accountBalance ? accountBalance.balance : null,
            userAddress: txHash.to,
          });
        });
        this.referralCommissionService.addReferralCommission(sub, amount);
      } catch (error) {
        console.error(error);
        await this.dataSource
          .getRepository(Transaction)
          .update(transaction.id, { status: TransactStatusEnum.Error });
      }
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

  @Get('invoice/:code')
  async getInvoice(@Req() req, @Param('code') code: string) {
    const { sub } = req.user;
    const invoice = await this.orderService.getOne(
      {
        code,
        userId: sub,
        expiredAt: MoreThan(new Date()),
      },
      {
        id: true,
        code: true,
        walletAddress: true,
        amount: true,
        coin: true,
        expiredAt: true,
        status: true,
        product: {
          price: true,
        },
      },
      {
        product: true,
      },
    );
    if (!invoice)
      throw new NotFoundException('Not found invoice or invoice is expired');
    invoice['price'] = invoice.product.price;
    delete invoice.id;
    delete invoice.product;
    return invoice;
  }

  @Get('/my-referrals')
  async getReferrals(@Req() req) {
    const { sub } = req.user;
    const [data, total] = await this.referralCommissionService.getAll(
      {
        receiverId: sub,
      },
      {
        value: true,
        coin: true,
        user: {
          email: true,
        },
      },
      {
        user: true,
      },
    );
    return { data, total };
  }
}
