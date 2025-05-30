import { IsOptional, IsString } from 'class-validator';

import { PlatformEnum } from '../../../common/enums';

export class CreateNotifyDto {
  @IsString()
  title: string;

  @IsOptional()
  description: string;

  @IsString()
  platform: PlatformEnum;

  @IsOptional()
  auto: boolean;

  @IsOptional()
  published: boolean;

  @IsOptional()
  startAt: Date;

  @IsOptional()
  endAt: Date;

  @IsOptional()
  condition: any;
}
