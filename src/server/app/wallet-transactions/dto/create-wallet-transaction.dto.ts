export class CreateWalletTransactionDto {
  userId: string;
  type: number;
  symbol: string;
  amount: BigInt;
  walletAddress: string;
  paymentAddress: string;
  status: number;
}
