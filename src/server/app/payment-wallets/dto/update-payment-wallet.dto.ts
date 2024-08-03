import { IsOptional } from 'class-validator';

export class UpdatePaymentWalletDto {
  @IsOptional()
  name: string;

  @IsOptional()
  chainId: number;

  @IsOptional()
  isOut: boolean;

  @IsOptional()
  walletAddress: string;

  @IsOptional()
  secret: string;

  @IsOptional()
  path: string;

  @IsOptional()
  coin: string;

  @IsOptional()
  image: string;

  @IsOptional()
  published: boolean;
}
