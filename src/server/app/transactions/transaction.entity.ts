import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { User } from '../users/user.entity';
import { PaymentAccount } from '../payment-wallet/payment-account.entity';

@Entity({ name: 'transaction' })
export class Transaction {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  userId: string;

  @Column({ name: 'payment_wallet_id', type: 'uuid', nullable: false })
  paymentWalletId: string;

  @Column({ name: 'payment_account_id', type: 'uuid', nullable: false })
  paymentAccountId: string;

  @Column({ nullable: false })
  type: number;

  @Column({ name: 'user_address', nullable: false })
  userAddress?: string;

  @Column({ name: 'tx_hash' })
  txHash?: string;

  @Column({ nullable: false })
  amount: number;

  @Column({ name: 'amount_usd' })
  amountUsd: number;

  @Column({ name: 'exchange_rate', nullable: false })
  exchangeRate: number;

  @Column({ nullable: false })
  coin: string;

  @Column({ name: 'wallet_balance', nullable: false })
  walletBalance: number;

  @Column()
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => PaymentAccount)
  @JoinColumn({ name: 'payment_account_id', referencedColumnName: 'id' })
  paymentAccount: PaymentAccount;
}
