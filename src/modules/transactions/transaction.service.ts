import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { buildQueryFilter } from '../../common/helpers/query-builder';
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

  getList(query?: any): Promise<[Transaction[], number]> {
    const qr = buildQueryFilter(query);
    qr.select = {
      id: true,
      txHash: true,
      amount: true,
      exchangeRate: true,
      coin: true,
      walletBalance: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      user: {
        email: true,
        walletAddress: true,
      },
      paymentWallet: {
        walletAddress: true,
      },
    };
    qr.relations = {
      user: true,
      paymentWallet: true,
    };
    if (query.email) {
      qr.where = {
        user: {
          email: ILike(`%${query.email}%`),
        },
      };
    }
    delete qr.where['email'];
    return this.repository.findAndCount(qr);
  }
}
