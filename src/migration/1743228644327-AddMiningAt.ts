import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMiningAt1743228644327 implements MigrationInterface {
  name = 'AddMiningAt1743228644327';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user" ADD mining_at TIMESTAMP;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user" DROP COLUMN mining_at;
    `);
  }
}
