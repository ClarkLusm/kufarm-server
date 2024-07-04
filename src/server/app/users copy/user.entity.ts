import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { Provider } from 'src/server/common/types/user';
import { Order } from '../user-products/user-product.entity';

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column({ nullable: false })
  username: string;

  @Field()
  @Column()
  balance: BigInt;

  @Field()
  @Column({ name: 'referral_balance' })
  referralBalance: BigInt;

  @Field()
  @Column({ name: 'count_referral' })
  countReferral: number;

  @Field()
  @Column({ name: 'referral_by' })
  referralBy: string;

  @Field()
  @Column({ name: 'email_verified' })
  emailVerified: boolean;

  @Field((_type) => [Order], { nullable: 'items' })
  @OneToMany((_type) => Order, (order) => order.user)
  orders?: Order[];

  @Field()
  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Field()
  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
