import { Body, Controller, Get, Post } from '@nestjs/common';

import { SETTING_REINVEST } from '../../common/constants';
import { SettingService } from './setting.service';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Controller()
export class SettingController {
  constructor(private readonly service: SettingService) {}

  @Get()
  async getList() {
    const items = await this.service.find({});
    if (!items.find((item) => item.key == SETTING_REINVEST)) {
      await this.service.create({
        key: SETTING_REINVEST,
        name: 'Cấu hình tái đầu tư',
        value: {
          autoReinvestEnabled: false,
          autoReinvestAmount: 0,
        },
      });
      return this.service.find({});
    }
    return items;
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
