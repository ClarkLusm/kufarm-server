import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  walletAddress: string;

  @IsOptional()
  banReason?: string;
}
