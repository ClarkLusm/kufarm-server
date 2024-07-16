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

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ name: 'product_id', nullable: false })
  productId: string;

  @Column({ name: 'max_out', nullable: false })
  maxOut: number;

  @Column({ nullable: false })
  income: number;

  @Column({ name: 'hash_power' })
  hashPower: number;

  @Column({ name: 'daily_income', nullable: false })
  dailyIncome: number;

  @Column({ name: 'monthly_income', nullable: false })
  monthlyIncome: number;

  @Column()
  status: number;

  @ManyToOne((_type) => User, (user) => user.userProducts)
  user: User;

  @OneToOne((_type) => Product)
  product: Product;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
