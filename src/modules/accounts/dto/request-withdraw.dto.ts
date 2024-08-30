import { IsNumber } from 'class-validator';

export class RequestWithdrawDto {
  @IsNumber()
  amount: number;
}