import { IsNotEmpty, ValidateIf } from 'class-validator';

export class CreatePaymentWalletDto {
  @IsNotEmpty()
  isOut: boolean;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  chainId: number;

  @IsNotEmpty()
  walletAddress: string;

  @ValidateIf((data) => data.isOut === true)
  @IsNotEmpty()
  secret?: string;

  @IsNotEmpty()
  coin: string;

  image?: string;

  published?: boolean;
}
