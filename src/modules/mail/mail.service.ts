import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { ACTIVE_ACCOUNT_TOKEN_EXPIRED_DURATION } from '../../common/constants';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

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
