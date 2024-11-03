import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTable1730658902071
  implements MigrationInterface
{
  name = 'AlterTable1730658902071';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "referral_commission" ADD cake_value NUMERIC(19,4) DEFAULT 0',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "referral_commission" DROP cake_value');
  }
}
