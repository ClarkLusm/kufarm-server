import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTable1728781643712
  implements MigrationInterface
{
  name = 'AlterTable1728781643712';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "referral_commission" ADD kas_value NUMERIC(19,4) DEFAULT 0',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "referral_commission" DROP kas_value');
  }
}
