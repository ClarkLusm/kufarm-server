import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { CreatePurchaseHistoryDto } from './dto/create-purchase-history.dto';
import { PurchaseHistory } from './purchase-history.entity';

@Injectable()
export class PurchaseHistoryService {
  constructor(
    @InjectRepository(PurchaseHistory)
    private purchaseHistoryRepository: Repository<PurchaseHistory>,
  ) {}

  create(user: CreatePurchaseHistoryDto) {
    return this.purchaseHistoryRepository.save(user);
  }

  findOne(params: FindOneOptions<PurchaseHistory> = {}) {
    return this.purchaseHistoryRepository.findOne(params);
  }

  findAll(params: FindManyOptions<PurchaseHistory> = {}) {
    return this.purchaseHistoryRepository.find(params);
  }
}
