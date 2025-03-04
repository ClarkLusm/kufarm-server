import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseQueryDto } from '../../../common/base/base.dto';

export class SearchUserDto extends BaseQueryDto {
  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  emailVerified?: boolean;
}
