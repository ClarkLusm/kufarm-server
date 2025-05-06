import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { User } from '../users/user.entity';

@Entity()
export class Reinvest {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn()
  id: string;

  @Column()
  code: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  userId: string;

  @Column({ name: 'prev_balance_usd', nullable: false })
  prevBalanceUsd: number;

  @Column({ name: 'prev_referral_commission', nullable: false })
  prevReferralCommission: number;

  @Column({ name: 'current_rate', nullable: false })
  currentRate: number;

  @Column({ nullable: false })
  amount: number;

  @Column({ name: 'daily_income', nullable: false })
  dailyIncome: number;

  @Column({ name: 'monthly_income', nullable: false })
  monthlyIncome: number;

  @Column({ name: 'hash_power', nullable: false })
  hashPower: number;

  @Column({ name: 'max_out', nullable: false })
  maxOut: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.reinvests)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
