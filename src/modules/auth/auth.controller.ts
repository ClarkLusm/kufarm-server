import { BadRequestException, Body, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import moment from 'moment';

import { OtpTypeEnum } from '../../common/enums';
import { OTP_LOGIN_EXPIRED_DURATION } from '../../common/constants';
import { UserService } from '../users/user.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { VerifyAccountDto } from '../accounts/dto';
import { AuthService } from './auth.service';
import { MailService } from '../mail/mail.service';
import { OtpService } from '../otp/otp.service';
import { SigninDto, SigninWithOTPDto } from './dto/signin.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly otpService: OtpService,
  ) {}

  @Post('/signin')
  async login(@Body() data: SigninDto) {
    return this.authService.login(data);
  }

  @Post('/otp-signin')
  async loginWithOtp(@Body() data: SigninWithOTPDto) {
    const { email, code } = data;
    try {
      return await this.authService.loginWithOTP(email, code);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
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

  @Post('/send-login-otp')
  async sendLoginOTP(@Body() data) {
    const { email } = data;
    const user = await this.userService.findOneBy({ email });
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    await this.otpService.delete({
      userId: user.id,
      type: OtpTypeEnum.signin,
    });
    const code = this.otpService.createOtp6Digits();
    await this.otpService.create({
      userId: user.id,
      otpCode: code,
      type: OtpTypeEnum.signin,
      expiredAt: moment().add(OTP_LOGIN_EXPIRED_DURATION, 'minutes').toDate(),
    });
    return await this.mailService.sendOTP(email, code);
  }
}
