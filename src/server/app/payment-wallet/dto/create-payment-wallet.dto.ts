import { IsNotEmpty } from 'class-validator';

export class CreatePaymentWalletDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  chainId: number;

  @IsNotEmpty()
  walletAddress: string;

  @IsNotEmpty()
  coin: string;

  image?: string;

  published?: boolean;
}
