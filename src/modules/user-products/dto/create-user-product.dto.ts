import { IsEnum, IsInt, IsNumber, IsUUID } from 'class-validator';

import { UserProductStatusEnum } from '../../../common/enums';

export class CreateUserProductDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  productId: string;

  @IsInt()
  hasPower: number;

  @IsNumber()
  dailyIncome: number;

  @IsNumber()
  monthlyIncome: number;

  @IsEnum(UserProductStatusEnum)
  status: UserProductStatusEnum;
}
