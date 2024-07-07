import { Transform, TransformFnParams } from 'class-transformer';

import { BaseQueryDto } from 'src/server/common/base/base.dto';

export class SearchProductDto extends BaseQueryDto {
  name?: string;
}
