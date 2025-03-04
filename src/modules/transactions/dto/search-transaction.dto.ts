import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class SearchTransactionDto {
  @ApiPropertyOptional()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  userAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  status?: number;

  @ApiPropertyOptional()
  @IsOptional()
  fromDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  toDate?: string;
}
