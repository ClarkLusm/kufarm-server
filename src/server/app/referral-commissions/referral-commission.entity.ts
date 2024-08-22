import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { User } from '../users/user.entity';

@Entity()
export class ReferralCommission {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn()
  id: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  userId: string;

  @Column({ name: 'receiver_id', type: 'uuid', nullable: false })
  receiverId: string;

  @Column({ nullable: false })
  level: number;

  @Column({ nullable: false, name: 'btco2_value' })
  btco2Value: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.referralCommissions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, (user) => user.receiverCommissions)
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;
}
