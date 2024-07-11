import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { User } from '../users/user.entity';

@Entity()
export class UserTransaction {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ nullable: false, comment: '1-withdraw 2-deposit' })
  type: number;

  @Column({ nullable: false })
  sender: string;

  @Column({ nullable: false })
  receiver: string;

  @Column({ nullable: false })
  coin: string;

  @Column({ name: 'tx_hash', nullable: false })
  txHash: string;

  @Column({ type: 'bigint', nullable: false })
  amount: number;

  @Column()
  status: number;

  @Column({ name: 'created_at' })
  @CreateDateColumn()
  createdAt: Date;

  @Column({ name: 'updated_at' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
