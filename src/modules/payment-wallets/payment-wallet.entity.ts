import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Transaction } from '../transactions/transaction.entity';

@Entity()
export class PaymentWallet {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'is_out' })
  isOut: boolean;

  @Column({ nullable: false })
  name: string;

  @Column({ name: 'wallet_address', nullable: false })
  walletAddress: string;

  @Column({ name: 'chain_id', nullable: false })
  chainId: number;

  @Column({ nullable: false })
  secret: string;

  @Column({ nullable: false })
  coin: string;

  @Column({ nullable: false })
  balance: number;

  @Column()
  image: string;

  @Column()
  iv: string;

  @Column()
  published: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.paymentWallet)
  transactions: Transaction[];
}
