import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VerifyAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  token: string;
}
