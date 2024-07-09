import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from 'src/server/common/base/base.service';
import { Config } from './config.entity';

@Injectable()
export class ConfigService extends BaseService<Config> {
  constructor(
    @InjectRepository(Config)
    public repository: Repository<Config>,
  ) {
    super(repository);
  }
}
