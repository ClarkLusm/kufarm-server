import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from 'src/server/common/base/base.service';
import { Setting } from './setting.entity';

@Injectable()
export class SettingService extends BaseService<Setting> {
  constructor(
    @InjectRepository(Setting)
    public repository: Repository<Setting>,
  ) {
    super(repository);
  }
}
