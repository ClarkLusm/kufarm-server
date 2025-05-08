import { IsOptional } from "class-validator";

export class UpdateProductDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  alias?: string;

  @IsOptional()
  price?: number;

  @IsOptional()
  salePrice?: number;

  @IsOptional()
  maxOut?: number;

  @IsOptional()
  image?: string;

  @IsOptional()
  hashPower?: number;

  @IsOptional()
  dailyIncome?: BigInt;

  @IsOptional()
  monthlyIncome?: BigInt;

  @IsOptional()
  published?: boolean;
}
