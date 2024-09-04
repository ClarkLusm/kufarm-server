import {
  Controller,
  Get,
  Query,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import moment from 'moment';

import { SEARCH_DATE_FORMAT } from '../../common/constants';
import { OrderStatusEnum } from '../../common/enums';
import { JwtAdminGuard } from '../admin-auth/jwt/jwt-auth.guard';
import { OrderService } from './order.service';
import { SearchOrderDto } from './dto/search-order.dto';

@Controller()
@UseGuards(JwtAdminGuard)
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

    // Remove the expired orders
    await this.service.deleteExpired();

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
