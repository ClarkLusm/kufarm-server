export class CreateTransactionDto {
  userId: string;
  type: number;
  symbol: string;
  amount: BigInt;
}
