import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceTransaction } from './balance-transaction.entity';
import { BalanceTransactionService } from './balance-transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([BalanceTransaction])],
  providers: [BalanceTransactionService],
  exports: [BalanceTransactionService],
})
export class BalanceTransactionModule {}
