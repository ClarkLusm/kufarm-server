import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsoleModule } from 'nestjs-console';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { SeedService } from 'src/server/console/seed.service';
import { AdminRouteModule } from '../routes/admin-router.module';
import { ClientRouteModule } from '../routes/client-router.module';
import { SettingModule } from './settings/setting.module';
import { AdminUserModule } from './admin-users/admin-user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        ssl:
          configService.get<string>('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
      inject: [ConfigService],
    }),
    ConsoleModule,
    SettingModule,
    AdminUserModule,
    AdminRouteModule,
    ClientRouteModule,
  ],
  providers: [SeedService],
})
export class AppModule { }
