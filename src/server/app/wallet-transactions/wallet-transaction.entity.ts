import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class WalletTransaction {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'uuid', name: 'user_id', nullable: false })
  userId: string;

  @Column({ nullable: false })
  type: number;

  @Column({ name: 'wallet_address', nullable: false })
  walletAddress: string;

  @Column({ name: 'payment_address', nullable: false })
  paymentAddress: string;

  @Column({ nullable: false })
  symbol: string;

  @Column({ type: 'bigint', nullable: false })
  amount: number;

  @Column()
  status: number;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
