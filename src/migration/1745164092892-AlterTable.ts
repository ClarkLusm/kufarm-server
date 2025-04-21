import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTable1745164092892 implements MigrationInterface {
  name = 'AlterTable1745164092892';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user" ADD custom_hash_power BOOLEAN DEFAULT false;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user" DROP COLUMN custom_hash_power;
    `);
  }
}
