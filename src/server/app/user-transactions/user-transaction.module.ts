import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTransaction } from './user-transaction.entity';
import { UserTransactionService } from './user-transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserTransaction])],
  providers: [UserTransactionService],
  exports: [UserTransactionService],
})
export class UserTransactionModule {}
