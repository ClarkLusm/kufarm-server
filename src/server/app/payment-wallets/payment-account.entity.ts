import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PaymentWallet } from './payment-wallet.entity';

@Entity()
export class PaymentAccount {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'account_address', nullable: false })
  accountAddress: string;

  @Column({ name: 'payment_wallet_id', type: 'uuid', nullable: false })
  paymentWalletId: string;

  @Column()
  balance?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => PaymentWallet, (wallet) => wallet.paymentAccounts)
  @JoinColumn({ name: 'payment_wallet_id' })
  paymentWallet: PaymentWallet;
}
