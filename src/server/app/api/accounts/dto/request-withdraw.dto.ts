import { IsEnum, IsNumber } from 'class-validator';
import { TransactionCoinEnum } from 'src/server/common/enums/transaction.enum';

export class RequestWithdrawDto {
  @IsNumber()
  amount: number;

  @IsEnum(TransactionCoinEnum)
  coin: TransactionCoinEnum;
}
