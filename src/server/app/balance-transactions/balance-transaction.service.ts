import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { CreateBalanceTransactionDto } from './dto/create-balance-transaction.dto';
import { BalanceTransaction } from './balance-transaction.entity';

@Injectable()
export class BalanceTransactionService {
  constructor(
    @InjectRepository(BalanceTransaction)
    private btRepository: Repository<BalanceTransaction>,
  ) {}

  create(user: CreateBalanceTransactionDto) {
    return this.btRepository.save(user);
  }

  findOne(params: FindOneOptions<BalanceTransaction> = {}) {
    return this.btRepository.findOne(params);
  }

  findAll(params: FindManyOptions<BalanceTransaction> = {}) {
    return this.btRepository.find(params);
  }
}
