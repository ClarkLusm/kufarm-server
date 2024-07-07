import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { CreateWalletTransactionDto } from './dto/create-wallet-transaction.dto';
import { WalletTransaction } from './wallet-transaction.entity';
import { BaseService } from 'src/server/common/base/base.service';

@Injectable()
export class WalletTransactionService extends BaseService<WalletTransaction> {
  constructor(
    @InjectRepository(WalletTransaction)
    public repository: Repository<WalletTransaction>,
  ) {
    super(repository);
  }
}
