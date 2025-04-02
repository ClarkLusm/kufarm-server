import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public sendOTP(sendTo: string | string[], code: string): void {
    this.mailerService
      .sendMail({
        to: sendTo,
        from: process.env.MAIL_SENDER,
        subject: '[miner86.com] Mã OTP đăng nhập của bạn',
        text: 'welcome',
        html: `Mã OTP của bạn là: <b>${code}</b><br><br>Mã này sẽ hết hạn sau 5 phút.<br>Vui lòng không chia sẻ mã này với bất kỳ ai.<br>Nếu bạn không yêu cầu mã này, xin hãy bỏ qua email này.<br>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!<br><br>Trân trọng.`,
      })
  }
}
