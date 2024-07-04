import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBalanceTransaction1719971654218
  implements MigrationInterface
{
  name = 'CreateBalanceTransaction1719971654218';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "balance_transaciton" (
        "id" UUID DEFAULT uuid_generate_v4(),
        "user_id" UUID NOT NULL,
        "type" integer,
        "amount" bigint,
        "symbol" varchar NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_1031171c13130102495201e3e22" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "balance_transaciton"`);
  }
}
