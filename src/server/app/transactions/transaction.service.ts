import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { BaseService } from 'src/server/common/base/base.service';
import { buildQueryFilter } from 'src/server/common/helpers/query-builder';
import { Transaction } from './transaction.entity';
import { User } from '../users/user.entity';
import {
  TransactStatusEnum,
  TransactionCoinEnum,
} from 'src/server/common/enums';

@Injectable()
export class TransactionService extends BaseService<Transaction> {
  constructor(
    @InjectRepository(Transaction)
    public repository: Repository<Transaction>,
    private readonly dataSource: DataSource,
  ) {
    super(repository);
  }

  getAll(query?: any): Promise<[Transaction[], number]> {
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

  async withdraw(userId: string, coin: TransactionCoinEnum, amount: number) {
    const user = await this.dataSource
      .getRepository(User)
      .findOneBy({ id: userId });

    if (coin === TransactionCoinEnum.Usd && user.balanceUsd < amount) {
      throw new Error('Usd balance is not enough');
    }
    if (coin === TransactionCoinEnum.BitcoinCo2 && user.balanceToken < amount) {
      throw new Error('Token balance is not enough');
    }
    //TODO: log transaction & decrease user balance

    await this.dataSource.transaction(async (tx) => {
      await tx.getRepository(Transaction).create({
        userId,
        receiver: user.walletAddress,
        sender: '',
        amount,
        coin,
        status: TransactStatusEnum.Pending,
      });
    });
  }
}
