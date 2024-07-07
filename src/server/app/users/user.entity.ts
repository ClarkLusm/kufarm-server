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
  @PrimaryGeneratedColumn()
  id: string;

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

  @Column({ type: 'bigint' })
  balance: any;

  @Column({ name: 'referral_balance', type: 'bigint' })
  referralBalance: any;

  @Column({ name: 'count_referral' })
  countReferral?: number;

  @Column({ name: 'referral_by' })
  referralBy?: string;

  @Column({ name: 'email_verified' })
  emailVerified?: boolean;

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
