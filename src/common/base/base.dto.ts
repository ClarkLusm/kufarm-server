// import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

import { PAGESIZE_DEFAULT, PAGE_DEFAULT } from '../constants/app';

export enum OrderEnum {
  DESC = 'DESC',
  ASC = 'ASC',
}
export class BaseQueryDto {
  // @ApiPropertyOptional({
  //   description: 'Số phần tử/trang',
  //   default: PAGESIZE_DEFAULT,
  // })
  @IsNumberString()
  @IsOptional()
  pageSize: number;

  // @ApiPropertyOptional({
  //   description: 'Trang số',
  //   default: PAGE_DEFAULT,
  // })
  @IsNumberString()
  @IsOptional()
  page: number;

  // @ApiPropertyOptional({
  //   description: 'Sắp xếp theo trường',
  // })
  @IsOptional()
  sort?: string;

  // @ApiPropertyOptional({
  //   description: 'Kiểu sắp xếp',
  //   enum: ['DESC', 'ASC'],
  // })
  @Transform(({ value }: TransformFnParams) => value?.trim()?.toUpperCase())
  @IsEnum(OrderEnum)
  @IsOptional()
  order?: string;
}
