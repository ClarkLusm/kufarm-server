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

  @IsNotEmpty()
  alias: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  salePrice?: number;

  @IsNotEmpty()
  @IsInt()
  duration: number;

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
