import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PaymentAccount {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'account_address', nullable: false })
  accountAddress: string;

  @Column({ name: 'payment_wallet_id', type: 'uuid', nullable: false })
  paymentWalletId: string;

  @Column({ type: 'bigint' })
  balance?: number;

  @Column({ name: 'created_at' })
  @CreateDateColumn()
  createdAt: Date;

  @Column({ name: 'updated_at' })
  @UpdateDateColumn()
  updatedAt: Date;
}
