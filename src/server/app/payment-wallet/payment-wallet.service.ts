import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { CreatePaymentWalletDto } from './dto/create-payment-wallet.dto';
import { PaymentWallet } from './payment-wallet.entity';

@Injectable()
export class PaymentWalletService {
  constructor(
    @InjectRepository(PaymentWallet)
    private paymentWalletRepository: Repository<PaymentWallet>,
  ) {}

  create(user: CreatePaymentWalletDto) {
    return this.paymentWalletRepository.save(user);
  }

  findOne(params: FindOneOptions<PaymentWallet> = {}) {
    return this.paymentWalletRepository.findOne(params);
  }

  findAll(params: FindManyOptions<PaymentWallet> = {}) {
    return this.paymentWalletRepository.find(params);
  }
}
