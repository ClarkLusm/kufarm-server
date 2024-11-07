import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsdAmount1731872012945 implements MigrationInterface {
  name = 'AddUsdAmount1731872012945';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "order" ADD usd_amount INTEGER DEFAULT 0;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "order" DROP COLUMN usd_amount;
    `);
  }
}
