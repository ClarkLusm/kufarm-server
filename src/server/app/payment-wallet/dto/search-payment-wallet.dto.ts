import { IsOptional } from "class-validator";

export class SearchPaymentWalletDto {
  @IsOptional()
  status?: number;
}
