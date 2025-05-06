import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class ConfigReinvestmentDto {
  @ApiProperty()
  @IsBoolean()
  autoReinvest: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  amount: number;
}
