import { Post } from '@nestjs/common';
import { Controller, Body } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto/login.dto';

@Controller()
export class AdminAuthController {
  constructor(
    private readonly adminAuthService: AdminAuthService,
  ) { }

  @Post('/login')
  async login(@Body() data: AdminLoginDto) {
    return this.adminAuthService.login(data);
  }
}
