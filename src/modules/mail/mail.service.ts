import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import {
  ACTIVE_ACCOUNT_TOKEN_EXPIRED_DURATION,
  OTP_LOGIN_EXPIRED_DURATION,
} from '../../common/constants';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public sendOTP(sendTo: string | string[], code: string) {
    try {
      this.mailerService.sendMail({
        to: sendTo,
        from: process.env.MAIL_SENDER,
        subject: '[miner86.com] Mã OTP đăng nhập của bạn',
        text: 'welcome',
        html: `Mã OTP của bạn là: <b>${code}</b><br><br>Mã này sẽ hết hạn sau ${OTP_LOGIN_EXPIRED_DURATION} phút.<br>Vui lòng không chia sẻ mã này với bất kỳ ai.<br>Nếu bạn không yêu cầu mã này, xin hãy bỏ qua email này.<br>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!<br><br>Trân trọng.`,
      });
    } catch (error) {
      console.error(error);
      throw new Error('Cannot send OTP code');
    }
  }

  /**
   * sendMailVerifyAccount
   */
  public sendMailVerifyAccount(
    sendTo: string | string[],
    activateLink: string,
  ) {
    this.mailerService.sendMail({
      to: sendTo,
      from: process.env.MAIL_SENDER,
      subject: '[miner86.com] Kích hoạt tài khoản',
      text: 'welcome',
      html: `Kính gửi Quý Khách Hàng,<br><br>Cảm ơn bạn đã đăng ký tài khoản tại miner86.com. Để hoàn tất quá trình đăng ký, vui lòng kích hoạt tài khoản của bạn bằng cách nhấp vào đây <a href="${activateLink}">Kích hoạt ngay</a><br><br>Liên kết kích hoạt sẽ hết hạn sau ${ACTIVE_ACCOUNT_TOKEN_EXPIRED_DURATION} giờ. Nếu bạn không thực hiện kích hoạt trong thời gian này, bạn sẽ cần yêu cầu một liên kết mới.<br><br>Trân trọng.`,
    });
  }
}
