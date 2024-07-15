import { Controller, Get, Query } from '@nestjs/common';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import * as moment from 'moment';

import { TransactionService } from './transaction.service';
import { SearchTransactionDto } from './dto/search-transaction.dto';
import { SEARCH_DATE_FORMAT } from 'src/server/common/constants';

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
    const [data, total] = await this.service.getAll(query);
    return {
      data,
      total,
    };
  }
}
