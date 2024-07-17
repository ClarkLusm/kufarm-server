import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

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

  createAdminUser() {
    const username = 'admin',
      password = 'admin';
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordHash = bcrypt.hashSync(password, salt);

    return this.create({
      username,
      passwordHash,
      salt,
    });
  }
}
