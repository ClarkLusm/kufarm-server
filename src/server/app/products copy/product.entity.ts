import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Order } from '../user-products/user-product.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  alias: string;

  @Column({ nullable: false })
  price: number;

  @Column({ name: 'sale_price' })
  salePrice: number;

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
