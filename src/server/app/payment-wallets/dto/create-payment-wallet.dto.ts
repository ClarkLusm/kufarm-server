import { IsNotEmpty } from 'class-validator';

export class CreatePaymentWalletDto {
  @IsNotEmpty()
  isOut: boolean;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  chainId: number;

  @IsNotEmpty()
  walletAddress: string;

  @IsNotEmpty()
  secret: string;

  @IsNotEmpty()
  coin: string;

  image?: string;

  published?: boolean;
}
