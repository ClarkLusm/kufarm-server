import { BaseQueryDto } from '../../../common/base/base.dto';

export class SearchUserDto extends BaseQueryDto {
  email?: string;

  emailVerified?: boolean;
}
