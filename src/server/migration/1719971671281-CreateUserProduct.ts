import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserProduct1719971671281 implements MigrationInterface {
  name = 'CreateUserProduct1719971671281';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "user_product" (
        "id" UUID DEFAULT uuid_generate_v4(),
        "user_id" UUID,
        "product_id" UUID,
        "duration" integer,
        "hash_power" integer,
        "daily_income" bigint,
        "monthly_income" bigint,
        "start_at" TIMESTAMP,
        "end_at" TIMESTAMP,
        "status" smallint,
        "sync_at" TIMESTAMP,
        "income" bigint,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_1031171c13130102495201e3e25" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_product"`);
  }
}
