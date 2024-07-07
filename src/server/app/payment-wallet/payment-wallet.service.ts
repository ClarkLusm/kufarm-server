import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { CreatePaymentWalletDto } from './dto/create-payment-wallet.dto';
import { PaymentWallet } from './payment-wallet.entity';
import { BaseService } from 'src/server/common/base/base.service';

@Injectable()
export class PaymentWalletService extends BaseService<PaymentWallet> {
  constructor(
    @InjectRepository(PaymentWallet)
    public repository: Repository<PaymentWallet>,
  ) {
    super(repository);
  }
}
