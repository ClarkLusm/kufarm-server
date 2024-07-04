import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PurchaseHistory {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'uuid', name: 'user_id', nullable: false })
  userId: string;

  @Column({ type: 'uuid', name: 'product_id', nullable: false })
  productId: string;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false })
  duration: number;

  @Column({ name: 'hash_power' })
  hashPower: number;

  @Column({ name: 'daily_income', nullable: false })
  dailyIncome: BigInt;

  @Column({ name: 'monthly_income', nullable: false })
  monthlyIncome: BigInt;

  @Column()
  status: number;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
