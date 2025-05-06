import { IsIn, IsNotEmpty, IsString } from 'class-validator';

import * as Constants from '../../../common/constants';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSettingDto {
  @ApiProperty()
  @IsString()
  @IsIn(
    [
      Constants.SETTING_SYSTEM,
      Constants.SETTING_REFERRAL_INCOME,
      Constants.SETTING_REINVEST,
    ],
    {
      message: 'Invalid configuration key',
    },
  )
  key: string;

  @ApiProperty()
  @IsNotEmpty()
  value: string | number | object;
}
