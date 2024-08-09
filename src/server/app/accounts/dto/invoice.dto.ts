import { IsNumber, IsString } from 'class-validator';

export class PayInvoiceDto {
  @IsString()
  code: string;

  @IsString()
  txHash: string;

  @IsNumber()
  amount: number;

  @IsString()
  walletAddress: string;
}
