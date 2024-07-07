import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { BaseService } from 'src/server/common/base/base.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    public repository: Repository<User>,
  ) {
    super(repository);
  }

  async createNewUser(data: CreateUserDto) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordHash = bcrypt.hashSync(data.password, salt);
    const userData = {
      username: data.username,
      email: data.email,
      passwordHash,
      salt,
      btcAddress: data.btcAddress,
      balance: BigInt(0),
      referralBalance: BigInt(0),
    };
    if (data.referralId) {
      userData['referralBy'] = data.referralId;
    }
    const user = await this.repository.save(userData);
    return user.id;
  }
}
