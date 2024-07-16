import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AdminUserService } from '../admin-users/admin-user.service';

@Injectable()
export class AdminAuthService {
  constructor(
    @Inject(AdminUserService) private adminUserService: AdminUserService,
    private readonly jwtService: JwtService,
  ) { }

  async login(userData: any) {
    try {
      const user = await this.validateUser(userData);
      const userDataAndTokens = await this.tokenSession(user);
      return userDataAndTokens;
    } catch (error) {
      throw console.log(error);
    }
  }

  async logout(refreshToken: string) { }

  async refreshToken(
    refreshtoken: string,
    res: any,
  ) {
    if (!refreshtoken)
      throw new UnauthorizedException({
        message: 'Пользователь не авторизован',
      });
    const userData = this.validateRefreshToken(refreshtoken);
    const tokenDb = '';
    if (!tokenDb) {
      res.clearCookie('sid');
      res.clearCookie('token');
      throw new UnauthorizedException({
        message:
          'refreshToken service: рефреш токен отсутствует в базе и пользователь не авторизован',
      });
    }
    const user = await this.adminUserService.findOne(userData.id);
    const userDataAndTokens = await this.tokenSession(user);
    return userDataAndTokens;
  }

  async tokenSession(userData: any) {
    if (!userData)
      throw new UnauthorizedException({
        message: '',
      });

    const tokens = await this.generateToken({ ...userData });
    return {
      statusCode: HttpStatus.OK,
      message: 'User information',
      user: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken, // refresh token only for mobile app
        user: userData,
      },
    };
  }

  async generateToken(user: any) {
    const payload = { email: user.email, id: user.id };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '10m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '60d',
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(userData: any): Promise<any> {
    try {
      const user = await this.adminUserService.findOneBy({
        username: userData.username,
      });
      if (!user)
        throw new UnauthorizedException({
          message: `User ${userData.username} not found`,
        });
      const isPasswordEquals = await bcrypt.compare(
        userData.password,
        user.passwordHash,
      );
      if (!isPasswordEquals)
        throw new UnauthorizedException({ message: `Incorrect password` });
      const { passwordHash, hash, ...result } = user;
      return result;
    } catch (error) {
      throw console.log(error);
    }
  }

  private validateRefreshToken(token: string) {
    try {
      const userData = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      return userData;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        // this.removeToken(token);
        throw new HttpException(
          `Срок действия рефреш токена истек`,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (error instanceof jwt.JsonWebTokenError)
        throw new HttpException(
          `Неверный формат рефреш токена`,
          HttpStatus.BAD_REQUEST,
        );
    }
  }
}
