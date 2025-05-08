import {
  IsOptional,
  IsNotEmpty,
  IsBoolean,
  IsInt,
  IsNumber,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  alias: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  salePrice?: number;

  @IsInt()
  maxOut: number;

  @IsOptional()
  image?: string;

  @IsNumber()
  hashPower: number;

  @IsNumber()
  dailyIncome: number;

  @IsNumber()
  monthlyIncome: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
