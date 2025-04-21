import {
  Controller,
  Get,
  Put,
  Query,
  Param,
  Body,
  ParseUUIDPipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ILike } from 'typeorm';

import { UserService } from './user.service';
import { SearchUserDto, BanUserDto, UpdateUserDto } from './dto';

@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('/')
  async getList(@Query() query: SearchUserDto) {
    const [data, total] = await this.service.getAll(
      {
        ...query,
        email: query.email ? ILike(`%${query.email}%`) : undefined,
      },
      {
        id: true,
        // username: true,
        email: true,
        emailVerified: true,
        walletAddress: true,
        countF1Referral: true,
        hasPurchased: true,
        createdAt: true,
        bannedAt: true,
        banReason: true,
      },
    );
    return {
      data,
      total,
    };
  }

  @Get(':id')
  async getDetail(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getOne({ id });
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateUserDto,
  ) {
    try {
      const user = await this.service.getById(id);
      if (!user) {
        throw new NotFoundException('Not found user');
      }
      return await this.service.updateProfile(user, data);
    } catch (error) {
      throw new BadRequestException(error?.message ?? '');
    }
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
    user.bannedAt = new Date();
    user.banReason = data.banReason;
    await this.service.updateById(id, data);
    return user;
  }
}
