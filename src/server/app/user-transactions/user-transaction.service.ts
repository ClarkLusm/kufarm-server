import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from 'src/server/common/base/base.service';
import { buildQueryFilter } from 'src/server/common/helpers/query-builder';
import { UserTransaction } from './user-transaction.entity';

@Injectable()
export class UserTransactionService extends BaseService<UserTransaction> {
  constructor(
    @InjectRepository(UserTransaction)
    public repository: Repository<UserTransaction>,
  ) {
    super(repository);
  }

  getAll(query?: any): Promise<[UserTransaction[], number]> {
    const qr = buildQueryFilter(query);
    qr.select = {
      id: true,
      type: true,
      sender: true,
      receiver: true,
      coin: true,
      amount: true,
      txHash: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      user: {
        username: true,
      },
    };
    qr.relations = {
      user: true,
    };
    return this.repository.findAndCount(qr);
  }
}
