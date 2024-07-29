import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSettingDto {
  @IsString()
  key: string;

  @IsNotEmpty()
  value: any;
}
