import { Post } from '@nestjs/common';
import { Controller, Get, Res } from '@nestjs/common';

@Controller()
export class AdminAuthController {
  @Post('/login')
  async login(@Res() res) {}
}
