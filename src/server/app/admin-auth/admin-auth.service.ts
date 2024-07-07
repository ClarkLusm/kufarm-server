import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  MethodNotAllowedException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { UserService } from '../users/user.service';

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userModel: Repository<User>,
    private jwtService: JwtService,
    @Inject(UserService) private userService: UserService,
  ) {}

  async login(userData: any, ip: string, ua: any, fingerprint, os: any) {
    try {
      const user = await this.validateUser(userData);
      if (user.banned)
        throw new UnauthorizedException({
          message: `Вы забанены ${user.banReason}`,
        });
      // console.log({ fingerprint: userData.fingerprint });
      const userDataAndTokens = await this.tokenSession(user);
      return userDataAndTokens;
    } catch (error) {
      throw console.log(error);
    }
  }

  async logout(refreshToken: string) {}

  async activateAccount(activationLink: string): Promise<any> {
    const user = await this.userService.findOne({});
    if (!user) {
      throw new HttpException(
        `Некорректная ссылка активации`,
        HttpStatus.BAD_REQUEST,
      );
    }
    user.emailVerified = true;
    await this.userService.updateById(user.id, { emailVerified: true });
    return user;
  }

  

  async refreshToken(
    refreshtoken: string,
    ip: string,
    ua: any,
    os: any,
    res: any,
    fingerprint: any,
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
    const user = await this.userModel.findOne(userData.id);
    if (user.banned)
      throw new UnauthorizedException({
        message: `Вы забанены ${user.banReason}`,
      });
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
