import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePaymentAccountDto {
  @IsNotEmpty()
  @MaxLength(42)
  accountAddress: string;

  @IsNotEmpty()
  path: string;
}
