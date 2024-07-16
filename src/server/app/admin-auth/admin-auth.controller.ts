import { Post } from '@nestjs/common';
import { Controller, Body } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminSigninDto } from './dto/signin.dto';

@Controller()
export class AdminAuthController {
  constructor(
    private readonly adminAuthService: AdminAuthService,
  ) { }

  @Post('/login')
  async login(@Body() data: AdminSigninDto) {
    return this.adminAuthService.login(data);
  }
}
