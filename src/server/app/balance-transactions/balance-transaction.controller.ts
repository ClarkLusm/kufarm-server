import { Controller, Get, Query } from '@nestjs/common';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import * as moment from 'moment';

import { BalanceTransactionService } from './balance-transaction.service';
import { SearchBalanceTransactionDto } from './dto/search-balance-transaction.dto';
import { SEARCH_DATE_FORMAT } from 'src/server/common/constants';

@Controller()
export class BalanceTransactionController {
  constructor(private readonly service: BalanceTransactionService) {}

  @Get('/')
  async getList(@Query() query: SearchBalanceTransactionDto) {
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
    const [data, total] = await this.service.getAll(query);
    return {
      data,
      total,
    };
  }
}
