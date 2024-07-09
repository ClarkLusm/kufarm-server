import { Inject } from '@nestjs/common';
import { Console, Command, createSpinner } from 'nestjs-console';

import {ConfigService} from '../app/configs/config.service';

@Console()
export class SeedService {

  constructor(
    @Inject(ConfigService) private configService: ConfigService,
  ){}
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
    return await this.configService.create({
      key: 'income_share',
      value: {
        usd: 50,
        bit: 50,
      }
    })
  }
}
