import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Notify } from './notify.entity';
import { NotifyService } from './notify.service';
import { NotifyController } from './notify.controller';

@Module({
  controllers: [NotifyController],
  imports: [TypeOrmModule.forFeature([Notify])],
  providers: [NotifyService],
  exports: [NotifyService],
})
export class NotifyModule {}
