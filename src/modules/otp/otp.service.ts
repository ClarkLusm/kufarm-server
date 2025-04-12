import { Injectable } from '@nestjs/common';
import { Otp } from './otp.entity';
import { BaseService } from 'src/common/base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OtpService extends BaseService<Otp> {
  constructor(
    @InjectRepository(Otp)
    public repository: Repository<Otp>,
  ) {
    super(repository);
  }

  createOtp6Digits(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async checkOtpValid(userId: string, code: string) {
    const data = await this.repository.findOneBy({ userId, otpCode: code });
    if (!data || data.expiredAt < new Date()) {
      throw new Error('OTP code is invalid');
    }
    this.repository.delete(data.id);
  }
}
