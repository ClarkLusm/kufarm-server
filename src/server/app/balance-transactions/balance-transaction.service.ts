import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from 'src/server/common/base/base.service';
import { BalanceTransaction } from './balance-transaction.entity';

@Injectable()
export class BalanceTransactionService extends BaseService<BalanceTransaction> {
  constructor(
    @InjectRepository(BalanceTransaction)
    public repository: Repository<BalanceTransaction>,
  ) {
    super(repository);
  }
}
