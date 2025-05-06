import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTable1746381892025 implements MigrationInterface {
  name = 'AlterTable1746381892025';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user" ADD auto_reinvest_enabled BOOLEAN DEFAULT false;
      ALTER TABLE "user" ADD auto_reinvest_amount INTEGER DEFAULT 0;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user" DROP COLUMN auto_reinvest_enabled;
      ALTER TABLE "user" DROP COLUMN auto_reinvest_amount;
    `);
  }
}
