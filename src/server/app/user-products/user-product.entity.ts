import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Entity()
export class UserProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: false })
  productId: string;

  @Column({ nullable: false })
  duration: number;

  @Column({ name: 'hash_power' })
  hashPower: number;

  @Column({ name: 'daily_income', type: 'bigint', nullable: false })
  dailyIncome: number;

  @Column({ name: 'monthly_income', type: 'bigint', nullable: false })
  monthlyIncome: number;

  @Column({ name: 'start_at', type: 'timestamptz' })
  startAt: Date;

  @Column({ name: 'end_at', type: 'timestamptz' })
  endAt: Date;

  @Column()
  status: number;

  @ManyToOne((_type) => User, (user) => user.userProducts)
  user: User;

  @OneToOne((_type) => Product)
  product: Product;

  @Column({ name: 'created_at' })
  @CreateDateColumn()
  createdAt: Date;

  @Column({ name: 'updated_at' })
  @UpdateDateColumn()
  updatedAt: Date;
}
