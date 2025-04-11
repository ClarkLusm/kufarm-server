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
    const user = await this.service.getById(id);
    if (!user) {
      throw new NotFoundException('Not found user');
    }
    let letUpdate = false;
    if (data.email && data.email !== user.email) {
      const validEmail = await this.service.checkUpdateEmailValid(
        user.id,
        data.email,
      );
      if (!validEmail) {
        throw new BadRequestException('Email has been used already');
      }
      user.email = data.email;
      letUpdate = true;
    }
    if (data.walletAddress) {
      user.walletAddress = data.walletAddress;
      letUpdate = true;
    }
    if (!user.bannedAt && data.banReason) {
      user.bannedAt = new Date();
      user.banReason = data.banReason;
      letUpdate = true;
    }
    if (user.bannedAt && !data.banReason) {
      user.bannedAt = null;
      user.banReason = null;
      letUpdate = true;
    }
    if (data.password) {
      const [passwordHash, salt] = this.service.hashPassword(data.password);
      user.passwordHash = passwordHash;
      user.salt = salt;
      letUpdate = true;
    }
    if (
      typeof data.emailVerified === 'boolean' &&
      data.emailVerified !== user.emailVerified
    ) {
      user.emailVerified = data.emailVerified;
      letUpdate = true;
    }
    if (letUpdate) {
      await this.service.save(user);
    }
    return user;
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
