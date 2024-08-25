import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn()
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  alias: string;

  @Column()
  image: string;

  @Column({ nullable: false })
  price: number;

  @Column({ name: 'sale_price' })
  salePrice: number;

  @Column({ name: 'max_out', nullable: false })
  maxOut: number;

  @Column({ name: 'hash_power' })
  hashPower: number;

  @Column({
    name: 'daily_income',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  dailyIncome: number;

  @Column({
    name: 'monthly_income',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  monthlyIncome: number;

  @Column()
  published: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
