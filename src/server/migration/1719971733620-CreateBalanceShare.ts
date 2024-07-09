import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBalanceShare1719971733620 implements MigrationInterface {
  name = 'CreateBalanceShare1719971733620';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "balance_share" (
        "id" UUID DEFAULT uuid_generate_v4(),
        "user_id" INTEGER NOT NULL,
        "value" BIGINT NOT NULL,
        "coin" VARCHAR NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_1032471c13130102495201e3d71" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "balance_share"`);
  }
}
