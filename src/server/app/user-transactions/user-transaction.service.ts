import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { CreateUserTransactionDto } from './dto/create-user-transaction.dto';
import { UserTransaction } from './user-transaction.entity';
import { BaseService } from 'src/server/common/base/base.service';

@Injectable()
export class UserTransactionService extends BaseService<UserTransaction> {
  constructor(
    @InjectRepository(UserTransaction)
    public repository: Repository<UserTransaction>,
  ) {
    super(repository);
  }
}
