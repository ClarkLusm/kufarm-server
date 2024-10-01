import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';

import { BaseService } from '../../common/base/base.service';
import { Notify } from './notify.entity';
import { PlatformEnum } from 'src/common/enums';

@Injectable()
export class NotifyService extends BaseService<Notify> {
  constructor(
    @InjectRepository(Notify)
    public repository: Repository<Notify>,
  ) {
    super(repository);
  }

  getAppNotify() {
    return this.repository.findOneBy({
      published: true,
      platform: In([PlatformEnum.app, PlatformEnum.web]),
      startAt: LessThanOrEqual(new Date()),
      endAt: MoreThanOrEqual(new Date()),
    });
  }
}
