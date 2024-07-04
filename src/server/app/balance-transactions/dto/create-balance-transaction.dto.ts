export class CreateBalanceTransactionDto {
  userId: string;
  type: number;
  symbol: string;
  amount: BigInt;
}
