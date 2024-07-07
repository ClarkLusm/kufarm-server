import { Controller, Get, Query, Param, ParseUUIDPipe } from '@nestjs/common';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import * as moment from 'moment';

import { PurchaseHistoryService } from './purchase-history.service';
import { SearchPurchaseHistoryDto } from './dto/search-purchase-history.dto';
import { SEARCH_DATE_FORMAT } from 'src/server/common/constants';

@Controller()
export class PurchaseHistoryController {
  constructor(private readonly service: PurchaseHistoryService) {}

  @Get('/')
  async getList(@Query() query: SearchPurchaseHistoryDto) {
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

  @Get(':id')
  async getDetail(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getOne({ id });
  }
}
