import { IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

export class CreatePaymentAccountDto {
  @IsUUID()
  paymentWalletId: string;

  @IsNotEmpty()
  @MaxLength(42)
  accountAddress: string;

  @IsNotEmpty()
  path: string;
}
