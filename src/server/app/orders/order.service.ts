import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, LessThanOrEqual, MoreThan, Repository } from 'typeorm';

import { BaseService } from 'src/server/common/base/base.service';
import { Order } from './order.entity';
import { buildQueryFilter } from 'src/server/common/helpers/query-builder';
import { OrderStatusEnum } from 'src/server/common/enums';

@Injectable()
export class OrderService extends BaseService<Order> {
  constructor(
    @InjectRepository(Order)
    public repository: Repository<Order>,
  ) {
    super(repository);
  }

  getAll(query?: any): Promise<[Order[], number]> {
    const qr = buildQueryFilter(query);
    qr.select = {
      id: true,
      amount: true,
      quantity: true,
      coin: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      user: {
        email: true,
        walletAddress: true,
      },
      product: {
        name: true,
        price: true,
      },
    };
    qr.relations = {
      user: true,
      product: true,
    };
    return this.repository.findAndCount(qr);
  }

  async getOrderPending(userId: string, productId: string, quantity: number) {
    // Update the order status based on the expiredAt field
    this.update(
      {
        userId,
        expiredAt: LessThanOrEqual(new Date()),
        status: OrderStatusEnum.Pending,
      },
      {
        status: OrderStatusEnum.Expired,
      },
    );
    return this.findOne({
      select: {
        code: true,
        walletAddress: true,
        quantity: true,
        amount: true,
        status: true,
        expiredAt: true,
        chainId: true,
      },
      where: {
        userId,
        productId,
        quantity,
        status: OrderStatusEnum.Pending,
        expiredAt: MoreThan(new Date()),
      },
    });
  }

  getInvoiceByOrderCode(userId: string, code: string) {
    return this.getOne(
      {
        code,
        userId,
        expiredAt: MoreThan(new Date()),
      },
      {
        id: true,
        code: true,
        walletAddress: true,
        amount: true,
        coin: true,
        chainId: true,
        expiredAt: true,
        status: true,
        product: {
          price: true,
        },
      },
      {
        product: true,
      },
    );
  }
}
