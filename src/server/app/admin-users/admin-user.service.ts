import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from 'src/server/common/base/base.service';
import { AdminUser } from './admin-user.entity';

@Injectable()
export class AdminUserService extends BaseService<AdminUser> {
  constructor(
    @InjectRepository(AdminUser)
    public repository: Repository<AdminUser>,
  ) {
    super(repository);
  }
}
