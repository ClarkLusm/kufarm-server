import { Inject } from '@nestjs/common';
import { Console, Command, createSpinner } from 'nestjs-console';

import { SettingService } from '../app/settings/setting.service';

@Console()
export class SeedService {
  constructor(@Inject(SettingService) private settingService: SettingService) {}
  @Command({
    command: 'seed',
    description: 'Seed DB',
  })
  async seed(): Promise<void> {
    const spin = createSpinner();

    spin.start('Seeding the DB');

    await this.initialConfiguration();

    spin.succeed('Seeding done');
  }

  async initialConfiguration() {
    return await this.settingService.create({
      key: 'income_share',
      value: {
        usd: 50,
        bit: 50,
      },
    });
  }
}
