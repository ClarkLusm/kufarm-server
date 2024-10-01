import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { NotifyService } from './notify.service';
import { UpdateNotifyDto } from './dto/update-notify.dto';
import { CreateNotifyDto } from './dto/create-notify.dto';

@Controller()
export class NotifyController {
  constructor(private readonly service: NotifyService) {}

  @Get()
  getList() {
    return this.service.find({});
  }

  @Post()
  createNotify(@Body() body: CreateNotifyDto) {
    return this.service.create(body);
  }

  @Post()
  updateNotify(@Param() id: string, @Body() body: UpdateNotifyDto) {
    return this.service.update(
      {
        id: id,
      },
      body,
    );
  }
}
