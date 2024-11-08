import { BadRequestException, Body, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';

import { UserService } from '../users/user.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SigninDto } from './dto/signin.dto';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signin')
  async login(@Body() data: SigninDto) {
    return this.authService.login(data);
  }

  @Post('/signup')
  async register(@Body() data: CreateUserDto) {
    try {
      const existedUsername = await this.userService.getOne({
        username: data.username,
      });
      if (existedUsername) {
        throw new Error('Username has been used already');
      }
      const existedEmail = await this.userService.getOne({ email: data.email });
      if (existedEmail) {
        throw new Error('Email has been used already');
      }
      const existedAddress = await this.userService.getOne({
        walletAddress: data.walletAddress,
      });
      if (existedAddress) {
        throw new Error(
          'Wallet address has been registered for another account',
        );
      }
      const user = await this.userService.createNewUser(data);
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
