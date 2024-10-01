import { IsOptional } from 'class-validator';
import { PlatformEnum } from 'src/common/enums';

export class UpdateNotifyDto {
  @IsOptional()
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  platform: PlatformEnum;

  @IsOptional()
  auto: boolean;

  @IsOptional()
  published: boolean;

  @IsOptional()
  startAt: Date;

  @IsOptional()
  endAt: Date;
}
