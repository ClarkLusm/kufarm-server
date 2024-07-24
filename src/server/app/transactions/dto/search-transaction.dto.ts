import { IsOptional } from "class-validator";

export class SearchTransactionDto {
  @IsOptional()
  userId?: string;

  @IsOptional()
  status?: number;

  @IsOptional()
  fromDate?: string;

  @IsOptional()
  toDate?: string;
}
