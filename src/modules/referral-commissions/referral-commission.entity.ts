import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
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

  @Column({ nullable: false, name: 'withdraw_value', type: 'numeric' })
  withdrawValue: number;

  @Column({ nullable: false, name: 'btco2_value', type: 'numeric' })
  btco2Value: number;

  @Column({ nullable: false, name: 'kas_value', type: 'numeric' })
  kasValue: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.referredUser)
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'id' })
  user: User;
}
