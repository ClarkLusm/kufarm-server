import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseHistory } from './purchase-history.entity';
import { PurchaseHistoryService } from './purchase-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseHistory])],
  providers: [PurchaseHistoryService],
  exports: [PurchaseHistoryService],
})
export class UsersModule {}
