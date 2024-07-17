import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class AdminUser {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  username: string;

  @Column({ name: 'password_hash', nullable: false })
  passwordHash: string;

  @Column({ nullable: false })
  salt: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
