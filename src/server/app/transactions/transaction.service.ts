import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '../../common/base/base.service';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionService extends BaseService<Transaction> {
  constructor(
    @InjectRepository(Transaction)
    public repository: Repository<Transaction>,
  ) {
    super(repository);
  }
}
