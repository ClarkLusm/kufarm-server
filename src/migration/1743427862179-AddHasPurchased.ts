import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHasPurchased1743427862179 implements MigrationInterface {
  name = 'AddHasPurchased1743427862179';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user" ADD has_purchased BOOLEAN DEFAULT false;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user" DROP COLUMN has_purchased;
    `);
  }
}
