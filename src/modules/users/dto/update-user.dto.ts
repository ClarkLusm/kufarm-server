import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  walletAddress: string;

  @ApiPropertyOptional()
  @IsOptional()
  banReason?: string;

  @ApiPropertyOptional()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  emailVerified?: boolean;
}
