import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../users/user.entity';

@Entity({ name: 'balance_transaction' })
export class BalanceTransaction {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ nullable: false })
  type: number;

  @Column({ type: 'uuid', nullable: false })
  amount: string;

  @Column({ nullable: false })
  coin: string;

  @Column({ name: 'created_at' })
  @CreateDateColumn()
  createdAt: Date;

  @Column({ name: 'updated_at' })
  @UpdateDateColumn()
  updatedAt: Date;

  // @ManyToOne(() => User, (user) => user.balanceTransactions)
  // @JoinColumn({ name: 'user_id' })
  // user: User;
}
