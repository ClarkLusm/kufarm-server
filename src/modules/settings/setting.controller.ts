import { Body, Controller, Get, Post } from '@nestjs/common';

import { SettingService } from './setting.service';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Controller()
export class SettingController {
  constructor(private readonly service: SettingService) {}

  @Get()
  getList() {
    return this.service.find({});
  }

  @Post()
  updateSetting(@Body() body: UpdateSettingDto) {
    return this.service.update(
      {
        key: body.key,
      },
      { value: body.value },
    );
  }
}
