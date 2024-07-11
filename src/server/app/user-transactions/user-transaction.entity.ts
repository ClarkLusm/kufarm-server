import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserTransaction {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'uuid', name: 'user_id', nullable: false })
  userId: string;

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

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
