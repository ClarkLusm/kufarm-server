import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BalanceTransaction {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @Column({ nullable: false })
  type: number;

  @Column({ type: 'uuid', nullable: false })
  amount: string;

  @Column({ nullable: false })
  symbol: string;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
