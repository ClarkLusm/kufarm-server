import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { BaseService } from 'src/server/common/base/base.service';
import { PurchaseHistory } from './purchase-history.entity';

@Injectable()
export class PurchaseHistoryService extends BaseService<PurchaseHistory> {
  constructor(
    @InjectRepository(PurchaseHistory)
    public repository: Repository<PurchaseHistory>,
  ) {
    super(repository);
  }
}
