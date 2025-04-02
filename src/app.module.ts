import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsoleModule } from 'nestjs-console';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

import {
  AdminRouteModule,
  ClientRouteModule,
  PublicRouteModule,
} from './routes';
import { SeedService } from './console/seed.service';
import { SettingModule } from './modules/settings/setting.module';
import { AdminUserModule } from './modules/admin-users/admin-user.module';
import { ProductModule } from './modules/products/product.module';

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
    MailerModule.forRoot({
      transport: `smtps://${process.env.MAIL_USERNAME}:${process.env.MAIL_PASSWORD}@smtp.gmail.com`,
      defaults: {
        from: `"Miner86" <${process.env.MAIL_SENDER}>`,
      },
    }),
    ConsoleModule,
    SettingModule,
    ProductModule,
    AdminUserModule,

    AdminRouteModule,
    ClientRouteModule,
    PublicRouteModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
