import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';

@Module({
  controllers: [TransactionController],
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}