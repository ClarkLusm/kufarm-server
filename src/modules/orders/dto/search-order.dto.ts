import { IsOptional } from "class-validator";

export class SearchOrderDto {
  @IsOptional()
  userId?: string;

  @IsOptional()
  productId?: string;

  @IsOptional()
  amount?: number;

  @IsOptional()
  status?: number;

  @IsOptional()
  fromDate?: string;

  @IsOptional()
  toDate?: string;
}
