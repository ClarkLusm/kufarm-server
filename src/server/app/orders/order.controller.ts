import { Controller, Get, Query, Param, ParseUUIDPipe } from '@nestjs/common';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import * as moment from 'moment';

import { OrderService } from './order.service';
import { SearchOrderDto } from './dto/search-order.dto';
import { SEARCH_DATE_FORMAT } from 'src/server/common/constants';

@Controller()
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Get('/')
  async getList(@Query() query: SearchOrderDto) {
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
