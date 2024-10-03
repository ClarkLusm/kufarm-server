import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  In,
  JsonContains,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

import { BaseService } from '../../common/base/base.service';
import { PlatformEnum } from '../../common/enums';
import { Notify } from './notify.entity';

@Injectable()
export class NotifyService extends BaseService<Notify> {
  constructor(
    @InjectRepository(Notify)
    public repository: Repository<Notify>,
  ) {
    super(repository);
  }

  getAppNotify(params) {
    const query = {
      published: true,
      platform: In([PlatformEnum.app, PlatformEnum.web]),
      startAt: LessThanOrEqual(new Date()),
      endAt: MoreThanOrEqual(new Date()),
    };
    if (params.access) {
      return this.repository.findOne({
        where: [
          { ...query, condition: JsonContains({ access: '' }) },
          { ...query, condition: JsonContains({ access: params.access }) },
        ],
      });
    }
    return this.repository.findOneBy(query);
  }
}
