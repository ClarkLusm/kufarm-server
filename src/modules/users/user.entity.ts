import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryColumn,
  OneToOne,
} from 'typeorm';

import { Order } from '../orders/order.entity';
import { UserProduct } from '../user-products/user-product.entity';
import { Transaction } from '../transactions/transaction.entity';
import { ReferralCommission } from '../referral-commissions/referral-commission.entity';
import { Reinvest } from '../reinvest/reinvest.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn()
  id: string;

  @Column({ nullable: false })
  sid: number;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  email: string;

  @Column({ name: 'wallet_address', nullable: false })
  walletAddress: string;

  @Column({ name: 'password_hash', nullable: false })
  passwordHash: string;

  @Column({ name: 'salt', nullable: false, select: false })
  salt: string;

  @Column({
    name: 'max_out',
    comment: 'Số tiền tối đa được nhận',
  })
  maxOut: number;

  @Column({ type: 'numeric', comment: 'Số tiền đã nhận' })
  income: number;

  @Column({ type: 'numeric' })
  balance: number;

  @Column({ name: 'referral_code' })
  referralCode?: string;

  @Column({ name: 'referral_by', type: 'uuid' })
  referralBy?: string;

  @Column({ name: 'referral_path' })
  referralPath?: string;

  @Column({ name: 'referral_commission', type: 'numeric', comment: 'USD' })
  referralCommission: number;

  @Column({ name: 'count_f1_referral' })
  countF1Referral?: number;

  @Column({ name: 'email_verified' })
  emailVerified?: boolean;

  @Column({ name: 'banned_at' })
  bannedAt?: Date;

  @Column({ name: 'ban_reason' })
  banReason?: string;

  @Column({ name: 'sync_at' })
  syncAt: Date;

  @Column({ name: 'mining_at' })
  miningAt: Date;

  @Column({ name: 'has_purchased', default: false })
  hasPurchased: boolean;

  @Column({ name: 'custom_hash_power', default: false })
  customHashPower: boolean;

  @Column({ name: 'auto_reinvest_enabled', default: false })
  autoReinvestEnabled: boolean;

  @Column({ name: 'auto_reinvest_amount' })
  autoReinvestAmount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => UserProduct, (userProduct) => userProduct.user)
  userProducts?: UserProduct[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToOne(() => ReferralCommission, (ref) => ref.user)
  referredUser: ReferralCommission;

  @OneToMany(() => Reinvest, (reinvest) => reinvest.user)
  reinvests: Reinvest[];
}
