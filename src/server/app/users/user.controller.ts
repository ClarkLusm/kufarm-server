import {
  Controller,
  Get,
  Put,
  Query,
  Param,
  Body,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';

import { UserService } from './user.service';
import { SearchUserDto } from './dto/search-user.dto';
import { BanUserDto } from './dto/ban-user.dto';

@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('/')
  async getList(@Query() query: SearchUserDto) {
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

  @Put(':id/ban-user')
  async banUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: BanUserDto,
  ) {
    const user = await this.service.getById(id);
    if (!user) {
      throw new NotFoundException('Not found user');
    }
    user.banned = data.banned;
    user.banReason = data.banReason;
    await this.service.updateById(id, data);
    return user;
  }
}
