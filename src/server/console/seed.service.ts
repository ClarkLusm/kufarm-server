import { Console, Command, createSpinner } from 'nestjs-console';

@Console()
export class SeedService {

  @Command({
    command: 'seed',
    description: 'Seed DB',
  })
  async seed(): Promise<void> {
    const spin = createSpinner();

    spin.start('Seeding the DB');

    // await this.seedThings();

    spin.succeed('Seeding done');
  }

}
