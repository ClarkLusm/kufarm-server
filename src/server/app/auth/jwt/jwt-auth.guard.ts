import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    let hasAccessTokenUser: any;
    let hasRefreshTokenUser: any;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    try {
      const authHeader = req.headers.authorization,
        bearer = authHeader.split(' ')[0];
      let accessToken = authHeader.split(' ')[1];
      if (bearer !== 'Bearer' || !accessToken) {
        throw new UnauthorizedException({
          message: 'User is not authorized',
        });
      }
      hasAccessTokenUser = this.jwtService.verify(accessToken);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new HttpException(
          `Срок действия access токена истек`,
          HttpStatus.UNAUTHORIZED,
        );
      }
      if (error instanceof jwt.JsonWebTokenError) {
        res.clearCookie('sid');
        res.clearCookie('token');
        throw new HttpException(
          `The access authorization token format is incorrect or it is missing`,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new UnauthorizedException({
        message: 'User is not authorized',
      });
    }

    // try {
    //   var refreshToken = req.cookies?.['token'];
    //   console.log('refreshToken', refreshToken);
    //   if (!refreshToken) {
    //     throw new UnauthorizedException({
    //       message: 'Пользователь не авторизован',
    //     });
    //   }
    //   hasRefreshTokenUser = this.jwtService.verify(refreshToken, {
    //     secret: process.env.JWT_REFRESH_SECRET,
    //   });
    //   console.log(hasRefreshTokenUser);
    // } catch (error) {
    //   if (error instanceof jwt.TokenExpiredError) {
    //     res.clearCookie('sid');
    //     res.clearCookie('token');
    //     throw new HttpException(
    //       `Срок действия рефреш токена истек`,
    //       HttpStatus.UNAUTHORIZED,
    //     );
    //   }
    //   if (error instanceof jwt.JsonWebTokenError) {
    //     res.clearCookie('sid');
    //     res.clearCookie('token');
    //     throw new HttpException(
    //       `Неверный формат рефреш токена авторизации или он отсутствует`,
    //       HttpStatus.BAD_REQUEST,
    //     );
    //   }
    // }

    // if (hasAccessTokenUser.email !== hasRefreshTokenUser.email) {
    //   throw new UnauthorizedException({
    //     message: 'Ваши токены входа не совпадают',
    //   });
    // }

    req.user = hasAccessTokenUser;
    return true;
  }
}
