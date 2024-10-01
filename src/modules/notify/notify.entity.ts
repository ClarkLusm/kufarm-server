import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Notify {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'jsonb' })
  condition: any;

  @Column()
  platform: string;

  @Column()
  auto: boolean;

  @Column()
  published: boolean;

  @Column({ name: 'start_at' })
  startAt: Date;

  @Column({ name: 'end_at' })
  endAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
