import { IsNumber, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsUUID()
  paymentWalletId: string;
}
