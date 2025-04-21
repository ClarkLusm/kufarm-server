import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class UpdateUserProductsDto {
  @ApiPropertyOptional()
  @IsOptional()
  customHashPower?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  userProducts?: UpdateUserProductDto[];
}

export class UpdateUserProductDto {
  @ApiProperty()
  @IsUUID()
  productId: string;

  @ApiProperty()
  @IsNumber()
  hashPower: number;

  @ApiProperty()
  @IsNumber()
  dailyIncome: number;

  @ApiProperty()
  @IsNumber()
  monthlyIncome: number;
}
