import { Controller, Get, Query } from '@nestjs/common';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import moment from 'moment';

import { SEARCH_DATE_FORMAT } from '../../common/constants';
import { TransactionService } from './transaction.service';
import { SearchTransactionDto } from './dto/search-transaction.dto';

@Controller()
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Get('/')
  async getList(@Query() query: SearchTransactionDto) {
    if (query.fromDate) {
      query['created_at'] = MoreThanOrEqual(
        moment(query.fromDate, SEARCH_DATE_FORMAT, true)
          .startOf('day')
          .toDate(),
      );
      delete query.fromDate;
    }
    if (query.toDate) {
      query['created_at'] = LessThanOrEqual(
        moment(query.toDate, SEARCH_DATE_FORMAT, true).endOf('day').toDate(),
      );
      delete query.toDate;
    }
    const [data, total] = await this.service.getAll(
      query,
      {
        id: true,
        txHash: true,
        amount: true,
        exchangeRate: true,
        coin: true,
        walletBalance: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        user: {
          email: true,
          walletAddress: true,
        },
        paymentWallet: {
          walletAddress: true,
        },
      },
      {
        user: true,
        paymentWallet: true,
      },
    );
    return {
      data,
      total,
    };
  }
}
