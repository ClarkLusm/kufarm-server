import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { CreateWalletTransactionDto } from './dto/create-wallet-transaction.dto';
import { WalletTransaction } from './wallet-transaction.entity';

@Injectable()
export class WalletTransactionService {
  constructor(
    @InjectRepository(WalletTransaction)
    private wtRepository: Repository<WalletTransaction>,
  ) {}

  create(user: CreateWalletTransactionDto) {
    return this.wtRepository.save(user);
  }

  findOne(params: FindOneOptions<WalletTransaction> = {}) {
    return this.wtRepository.findOne(params);
  }

  findAll(params: FindManyOptions<WalletTransaction> = {}) {
    return this.wtRepository.find(params);
  }
}
