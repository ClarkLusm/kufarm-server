import { IsObject, IsString } from 'class-validator';

type BlockchainTransaction = {
  hash: string;
  from: string;
  to: string;
  amount: BigInt;
};

export class PayOrderDto {
  @IsString()
  code: string;

  @IsObject()
  tx: BlockchainTransaction;

  @IsString()
  walletAddress: string;
}
