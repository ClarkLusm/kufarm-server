import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletTransaction } from './wallet-transaction.entity';
import { WalletTransactionService } from './wallet-transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([WalletTransaction])],
  providers: [WalletTransactionService],
  exports: [WalletTransactionService],
})
export class WalletTransactionModule {}
