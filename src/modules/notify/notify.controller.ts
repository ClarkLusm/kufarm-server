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

const conditionDefault = {
  access: '',
  deplay: 0,
};

@Controller()
export class NotifyController {
  constructor(private readonly service: NotifyService) {}

  @Get()
  async getList(@Query() query) {
    const [data, total] = await this.service.getAll(query);
    return { data, total };
  }

  @Post()
  createNotify(@Body() data: CreateNotifyDto) {
    return this.service.create({
      ...data,
      condition: { ...conditionDefault, ...data.condition },
    });
  }

  @Put(':id')
  updateNotify(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateNotifyDto,
  ) {
    return this.service.updateById(id, {
      ...data,
      condition: { ...conditionDefault, ...data.condition },
    });
  }
}
