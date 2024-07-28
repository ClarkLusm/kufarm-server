import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(userData: any) {
    const user = await this.validateUser(userData);
    if (user.bannedAt)
      throw new UnauthorizedException({
        message: `Your account has been banned ${user.banReason}`,
      });
    if (!user.emailVerified)
      throw new UnauthorizedException({
        message: `Your account has not yet activated`,
      });
    const userDataAndTokens = await this.tokenSession(user);
    return userDataAndTokens;
  }

  async validateUser(userData: any): Promise<any> {
    const user = await this.userService.findOneBy({
      email: userData.email,
    });
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
      secret: process.env.JWT_ACCESS_SECRET,
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
}
