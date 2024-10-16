import { DataSource, In } from 'typeorm';
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
import { ethers } from 'ethers';

import { EthersService } from '../../libs/ethers/ethers.service';
import {
  OrderStatusEnum,
  TransactStatusEnum,
  UserProductStatusEnum,
} from '../../common/enums';
import { decryptedWalletKey } from '../../utils';
import { numberToBigInt } from '../../common/helpers/number.utils';
import { getContractToken } from '../../common/helpers/token.helper';
import { USDT_DECIMALS } from '../../common/constants';
import { SettingService } from '../settings/setting.service';
import { PaymentWalletService } from '../payment-wallets/payment-wallet.service';
import { UserProductService } from '../user-products/user-product.service';
import { TransactionService } from '../transactions/transaction.service';
import { ProductService } from '../products/product.service';
import { OrderService } from '../orders/order.service';
import { UserService } from '../users/user.service';
import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { Transaction } from '../transactions/transaction.entity';
import { ReferralCommissionService } from '../referral-commissions/referral-commission.service';
import { UserProduct } from '../user-products/user-product.entity';
import {
  CreateOrderDto,
  PayOrderDto,
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
    const limit = query.hasOwnProperty('pageSize') ? query.pageSize : 20;
    const page = query.hasOwnProperty('page') ? query.page : 1;
    const offset = (page - 1) * limit;
    const [data, total] = await this.userService.getReferralsByPath(
      sub,
      user.referralPath,
      offset,
      limit,
    );
    if (total) {
      const referralUserIds = data.map((r) => r.id);
      const referralCommissions = await this.referralCommissionService.find({
        select: {
          userId: true,
          btco2Value: true,
          level: true,
          updatedAt: true,
        },
        where: {
          userId: In(referralUserIds),
          receiverId: sub,
        },
      });

      const referralMap = new Map();
      for (let index = 0; index < referralCommissions.length; index++) {
        const { userId, ...value } = referralCommissions[index];
        referralMap.set(userId, value);
      }

      const sumAmount =
        (await this.orderService.sum('amount', {
          userId: In(referralUserIds),
          status: OrderStatusEnum.Success,
        })) || 0;

      return {
        data: data.map((r) => ({
          ...r,
          ...(referralMap.get(r.id) || {
            btco2Value: 0,
            level: this.userService.getReferralLevelByPath(
              user.referralPath,
              r.referralPath,
            ),
            updatedAt: null,
          }),
          referralPath: undefined,
        })),
        total,
        investTotal: Number(
          ethers.formatUnits(sumAmount.toString(), USDT_DECIMALS),
        ),
      };
    }

    return {
      data: data.map((r) => ({
        ...r,
        btco2Value: 0,
        level: this.userService.getReferralLevelByPath(
          user.referralPath,
          r.referralPath,
        ),
        updatedAt: null,
        referralPath: undefined,
      })),
      total,
      investTotal: 0,
    };
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
    const [balanceToken, rate] = await this.settingService.convertUsdAndBTCO2(
      user.balance,
    );
    return {
      pool: 'stratum+tcp://sha256d.kupool.com:443',
      balance: user.balance,
      balanceToken: balanceToken.toString(),
      username: user.username,
      email: user.email,
      walletAddress: user.walletAddress,
      referralCode: user.referralCode,
      referralCommission: user.referralCommission,
      ...miningInfo,
    };
  }

  @Get('/orders')
  async getOrderHistory(@Req() req, @Query() query: SearchOrderDto) {
    const { sub } = req.user;
    const [data, total] = await this.orderService.getAll({
      ...query,
      userId: sub,
    });
    return { data, total };
  }

  @Get('/transactions')
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
  async createNewOrder(
    @Req() req,
    @Body() body: CreateOrderDto,
  ): Promise<Order> {
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
    let order = await this.orderService.getOrderPending(
      sub,
      productId,
      quantity,
    );

    // Create new order
    if (!order) {
      const orderPrice = product.price * quantity;
      const token = getContractToken(wallet.chainId, wallet.coin);
      const amount = orderPrice * Math.pow(10, token.decimals);
      order = await this.orderService.create({
        code: `${user.sid}${moment().format('YYMMDDHHmmss')}`,
        walletAddress: wallet.walletAddress,
        userId: sub,
        productId,
        quantity,
        amount,
        coin: wallet.coin,
        chainId: wallet.chainId,
        expiredAt: moment().add(30, 'minutes').format(),
      });
    }
    const token = getContractToken(order.chainId, wallet.coin);
    if (token) {
      order['tokenAddress'] = token.address;
      order['tokenDecimals'] = token.decimals;
      return order;
    }
  }

  @Post('/withdraw')
  async withdraw(@Req() req, @Body() body: RequestWithdrawDto) {
    try {
      const { sub } = req.user;
      const { amount, transactionFee } = body;
      const { balance: userBalance } = await this.userService.syncBalance(sub);
      const user = await this.userService.getById(sub);

      const token = getContractToken(
        process.env.NODE_ENV === 'production' ? 56 : 97,
        'BTCO2',
      );
      const amountBigInt: BigInt = numberToBigInt(amount, token.decimals);
      const realAmount = amount - transactionFee; //TODO: Should checking the transaction fee from the db

      const [tokenBalance, rate] = await this.settingService.convertUsdAndBTCO2(
        userBalance,
      );

      const refCommission: number = Number(user.referralCommission || 0);
      const sumBalanceToken = refCommission + tokenBalance;
      if (sumBalanceToken < amount) {
        throw new Error('Your balance is not enough');
      }

      const paymentWallet = await this.paymentWalletService.getWalletPayout(
        Number(numberToBigInt(realAmount, token.decimals)),
      );
      if (!paymentWallet) {
        throw new Error(
          'The system is busy. Please contact our support to resolve your issue!',
        );
      }

      let txHash: { hash: string };
      try {
        if (paymentWallet.secret) {
          paymentWallet.secret = decryptedWalletKey(paymentWallet.secret);
        }
        txHash = await this.ethersService.sendBTCO2Token(
          paymentWallet,
          user.walletAddress,
          realAmount.toString(),
        );
      } catch (error) {
        console.error(error);
        throw new Error('The system is busy.');
      }
      // fetch account balance again
      const accountBalance = await this.paymentWalletService.syncAccountBalance(
        paymentWallet,
      );

      let balanceRemain = userBalance,
        refCommissionRemain = refCommission,
        [amountUsd] = await this.settingService.convertUsdAndBTCO2(
          amount,
          rate,
          true,
        );

      if (refCommission >= amount) {
        refCommissionRemain = refCommission - amount;
      } else if (refCommission <= 0) {
        balanceRemain -= amountUsd;
      } else {
        const amountRemain = amount - refCommission;
        const [amountUsd] = await this.settingService.convertUsdAndBTCO2(
          amountRemain,
          rate,
          true,
        );
        refCommissionRemain = 0;
        balanceRemain -= amountUsd;
      }

      await this.dataSource.transaction(async (tx) => {
        await tx.getRepository(User).update(user.id, {
          balance: balanceRemain,
          referralCommission: refCommissionRemain,
        });
        await tx.getRepository(Transaction).save({
          userId: user.id,
          paymentWalletId: paymentWallet.id,
          userAddress: user.walletAddress,
          amount: Number(amountBigInt),
          amountUsd,
          exchangeRate: rate,
          coin: 'BTCO2', // TODO: Only withdraw BTCO2
          status: TransactStatusEnum.Success,
          txHash: txHash?.hash,
          walletBalance: accountBalance ? accountBalance.balance : null,
        });
      });
      this.referralCommissionService.addReferralCommission(sub, amount);
    } catch (error) {
      console.error(error);
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
    const invoice = await this.orderService.getInvoiceByOrderCode(sub, code);
    if (!invoice)
      throw new NotFoundException('Not found invoice or invoice is expired');
    invoice['price'] = invoice.product.price;
    delete invoice.id;
    delete invoice.product;
    const token = getContractToken(invoice.chainId, invoice.coin);
    if (token) {
      return {
        ...invoice,
        contractAddress: token.address,
        decimals: token.decimals,
        amountText: Number(invoice.amount).toLocaleString('fullwide', { useGrouping: false }),
      };
    }
  }

  @Post('/payorder')
  async payOrder(@Req() req, @Body() body: PayOrderDto) {
    const { sub } = req.user;
    const invoice = await this.orderService.getOne(
      {
        userId: sub,
        code: body.code,
        status: OrderStatusEnum.Pending,
      },
      {
        id: true,
        product: {
          id: true,
          hashPower: true,
          dailyIncome: true,
          monthlyIncome: true,
          maxOut: true,
        },
      },
      {
        product: true,
      },
    );
    if (!invoice) throw new NotFoundException('Not found invoice');
    //TODO: check first order to count f1
    //TODO: Verify via txHash on the blockchain
    const user = await this.userService.getById(sub);
    await this.dataSource.transaction(async (tx) => {
      await tx.getRepository(Order).update(invoice.id, {
        status: OrderStatusEnum.Success,
        txHash: body.tx.hash,
      });
      await tx.getRepository(UserProduct).save({
        userId: sub,
        productId: invoice.product.id,
        maxOut: invoice.product.maxOut,
        hashPower: invoice.product.hashPower,
        dailyIncome: invoice.product.dailyIncome,
        monthlyIncome: invoice.product.monthlyIncome,
        status: UserProductStatusEnum.Activated,
      });
      await tx.getRepository(User).update(sub, {
        maxOut: user.maxOut + invoice.product.maxOut,
        syncAt: user.syncAt || new Date(),
      });
    });
  }
}
