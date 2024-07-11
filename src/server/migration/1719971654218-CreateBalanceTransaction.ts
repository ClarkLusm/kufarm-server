import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBalanceTransaction1719971654218
  implements MigrationInterface
{
  name = 'CreateBalanceTransaction1719971654218';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "balance_transaciton" (
        "id" UUID DEFAULT uuid_generate_v4(),
        "user_id" INTEGER NOT NULL,
        "type" INTEGER,
        "amount" BIGINT,
        "coin" VARCHAR NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_1031171c13130102495201e3e42" PRIMARY KEY ("id"),
        CONSTRAINT "FK_1031171c13130102495201e3e43" FOREIGN KEY (user_id) REFERENCES "user" (id)
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "balance_transaciton"`);
  }
}
