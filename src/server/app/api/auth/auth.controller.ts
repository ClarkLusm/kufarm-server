import { BadRequestException, Body, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { UserService } from '../../users/user.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
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
    const existedUsername = await this.userService.getOne({
      username: data.username,
    });
    if (existedUsername) {
      throw new BadRequestException('Username has been used already');
    }
    const existedEmail = await this.userService.getOne({ email: data.email });
    if (existedEmail) {
      throw new BadRequestException('Email has been used already');
    }
    if (data.referralId) {
      const referralUser = await this.userService.getById(data.referralId);
      if (
        !referralUser ||
        !referralUser?.emailVerified ||
        referralUser?.banned
      ) {
        throw new BadRequestException('Referral user is not existed');
      }
      data['referralPath'] = referralUser.referralPath;
    }
    const user = await this.userService.createNewUser(data);
    return user;
  }
}
