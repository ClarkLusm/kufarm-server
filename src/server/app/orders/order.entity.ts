import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Entity()
export class Order {
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

  @Column({ name: 'daily_income', type: 'bigint', nullable: false })
  dailyIncome: number;

  @Column({ name: 'monthly_income', type: 'bigint', nullable: false })
  monthlyIncome: number;

  @Column()
  status: number;

  @Column({ name: 'created_at' })
  @CreateDateColumn()
  createdAt: Date;

  @Column({ name: 'updated_at' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => Product)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product;
}
