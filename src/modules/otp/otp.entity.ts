import { OtpTypeEnum } from 'src/common/enums';
import {
  Entity,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('otp')
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn()
  id: string;

  @Column({ name: 'otp_code', type: 'varchar', length: 8 })
  otpCode: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  userId: string;

  @Column({ enum: OtpTypeEnum })
  type: OtpTypeEnum;

  @Column({ name: 'expired_at' })
  expiredAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
