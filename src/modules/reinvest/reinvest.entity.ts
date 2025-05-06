import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { ReinvestStatusEnum } from '../../common/enums/reinvest.enum';
import { User } from '../users/user.entity';

@Entity()
export class Reinvest {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn()
  id: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  userId: string;

  @Column({ name: 'to_usd_rate', nullable: false })
  toUsdRate: number;

  @Column({ nullable: false })
  amount: number;

  @Column({ nullable: false })
  income: number;

  @Column({ name: 'max_out', nullable: false })
  maxOut: number;

  @Column()
  status: ReinvestStatusEnum;

  @Column({ name: 'sync_at' })
  syncAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.reinvests)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
