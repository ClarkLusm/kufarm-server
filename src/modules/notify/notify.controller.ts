import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { NotifyService } from './notify.service';
import { UpdateNotifyDto } from './dto/update-notify.dto';
import { CreateNotifyDto } from './dto/create-notify.dto';

@Controller()
export class NotifyController {
  constructor(private readonly service: NotifyService) {}

  @Get()
  async getList(@Query() query) {
    const [data, total] = await this.service.getAll(query);
    return { data, total };
  }

  @Post()
  createNotify(@Body() body: CreateNotifyDto) {
    return this.service.create(body);
  }

  @Put(':id')
  updateNotify(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateNotifyDto,
  ) {
    return this.service.updateById(id, data);
  }
}
