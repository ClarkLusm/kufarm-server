import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber } from 'class-validator';

export class RequestWithdrawDto {
  @ApiProperty()
  @IsInt({ message: 'Amount is invalid number' })
  amount: number;

  @ApiProperty()
  @IsNumber()
  transactionFee: number;
}
