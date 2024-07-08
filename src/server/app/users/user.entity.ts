import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserProduct } from '../user-products/user-product.entity';

@Entity()
export class User {  
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'uuid' })
  uid: string;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  email: string;

  @Column({ name: 'btc_address', nullable: false })
  btcAddress: string;

  @Column({ name: 'password_hash', nullable: false })
  passwordHash: string;

  @Column({ name: 'salt', nullable: false })
  salt: string;

  @Column({ type: 'bigint', comment: 'BTC balance' })
  balance: number;

  @Column({ name: 'referral_by' })
  referralBy?: number;
  
  @Column({ name: 'referral_path' })
  referralPath?: string;

  @Column({ name: 'referral_balance', comment: 'USD unit' })
  referralBalance: number;

  @Column({ name: 'referral_income', comment: 'USD unit' })
  referralIncome: number

  @Column({ name: 'email_verified' })
  emailVerified?: boolean;

  @Column({ name: 'count_referral' })
  countReferral?: number;

  @Column()
  banned?: boolean;

  @Column({ name: 'ban_reason' })
  banReason?: string;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany((_type) => UserProduct, (userProduct) => userProduct.user)
  userProducts?: UserProduct[];
}
