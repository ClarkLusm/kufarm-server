import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { ACTIVE_ACCOUNT_TOKEN_EXPIRED_DURATION } from '../../common/constants';
import { UserService } from '../users/user.service';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(OtpService) private otpService: OtpService,
    private jwtService: JwtService,
  ) {}

  async login(userData: any) {
    const user = await this._validateAuthUser(userData);
    // hide the referral code if the user does not bought any product
    if (!user.hasPurchased) {
      delete user.referralCode;
    }
    const userDataAndTokens = await this.tokenSession(user);
    return userDataAndTokens;
  }

  async loginWithOTP(email: string, otpCode: string) {
    const user = await this._validateUser(email);
    if (!user.hasPurchased) {
      delete user.referralCode;
    }
    await this.otpService.checkOtpValid(user.id, otpCode);
    const userDataAndTokens = await this.tokenSession(user);
    return userDataAndTokens;
  }

  async _validateUser(email: string) {
    const user = await this.userService.findOneBy({ email });
    if (!user)
      throw new UnauthorizedException({
        message: `User with email ${email} not found`,
      });
    if (user.bannedAt)
      throw new UnauthorizedException({
        message: `Your account has been banned ${user.banReason}`,
      });
    if (!user.emailVerified)
      throw new UnauthorizedException({
        message:
          'Your account has not been activated yet.\nPlease verify your email before logging in',
      });
    return user;
  }

  async _validateAuthUser(userData: any): Promise<any> {
    const user = await this._validateUser(userData.email);
    if (!user)
      throw new UnauthorizedException({
        message: `User with email ${userData.email} not found`,
      });
    const isPasswordEquals = await bcrypt.compare(
      userData.password,
      user.passwordHash,
    );
    if (!isPasswordEquals)
      throw new UnauthorizedException({ message: `Incorrect password` });
    const { passwordHash, salt, ...result } = user;
    return result;
  }

  async tokenSession(userData: any) {
    if (!userData)
      throw new UnauthorizedException({
        message: '',
      });

    const tokens = await this.generateToken({ ...userData });
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: userData,
    };
  }

  async generateToken(user: any) {
    const payload = { email: user.email, sub: user.id };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async resetPassword(email: any) {
    const user = await this.userService.findOneBy({ email });

    if (!user) {
      throw new BadRequestException('Invalid email');
    }

    if (!user.emailVerified) {
      throw new BadRequestException('Account need to be verify');
    }

    // const forgotLink = `${process.env.CLIENT_URL}/join/resetpwd?link=${linkReset}`;
  }

  async changeResetPassword(email: any, resetLink: any) {
    const user = await this.userService.findOneBy({ email });

    if (!user) {
      throw new BadRequestException('Invalid email');
    }

    return true;
  }

  async newResetPassword(email: any, password: any) {
    const user = await this.userService.findOneBy({ email });

    if (!user) {
      throw new BadRequestException('Invalid email');
    }

    const hashPassword = await bcrypt.hash(password, 5);
    user.passwordHash = hashPassword;

    await this.userService.updateById(user.id, user);

    return;
  }

  _createActivationToken(email: string): string {
    return this.jwtService.sign(
      {
        email,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: `${ACTIVE_ACCOUNT_TOKEN_EXPIRED_DURATION}h`,
      },
    );
  }

  createActivationLink(email: string) {
    const token = this._createActivationToken(email);
    return `${process.env.FRONTEND_URL}/account-verification?token=${token}`;
  }

  verifyActivationToken(token: string) {
    try {
      this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      return this.jwtService.decode(token);
    } catch (error) {
      return null;
    }
  }
}
