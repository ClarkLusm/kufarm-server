import { BadRequestException, Body, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';

import { UserService } from '../users/user.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { VerifyAccountDto } from '../accounts/dto';
import { AuthService } from './auth.service';
import { MailService } from '../mail/mail.service';

@Controller()
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  @Post('/signin')
  async login(@Body() data: SigninDto) {
    return this.authService.login(data);
  }

  @Post('/signup')
  async register(@Body() data: CreateUserDto) {
    try {
      // const existedUsername = await this.userService.getOne({
      //   username: data.username,
      // });
      // if (existedUsername) {
      //   throw new Error('Username has been used already');
      // }
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
      const activationLink = this.authService.createActivationLink(data.email);
      this.mailService.sendMailVerifyAccount(data.email, activationLink);
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('/active-account')
  async activeAccount(@Body() data: VerifyAccountDto) {
    try {
      const { token } = data;
      const decodeData = this.authService.verifyActivationToken(token);
      if (decodeData) {
        const user = await this.userService.getOne({ email: decodeData.email });
        if (!user) {
          throw new BadRequestException('Account does not exist');
        }
        if (user.emailVerified) {
          throw new BadRequestException(
            'Your account has already successfully been verified',
          );
        }
        await this.userService.updateById(user.id, { emailVerified: true });
        return;
      }
      throw new BadRequestException('Token invalid');
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }
}
