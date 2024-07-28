export type PaymentWallet = {
  id?: string;
  isOut: boolean;
  name: string;
  walletAddress: string;
  chainId: number;
  coin: string;
  secret: string;
  path: string;
  published: boolean;
};
