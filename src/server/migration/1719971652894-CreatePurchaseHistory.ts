import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePurchaseHistory1719971652894 implements MigrationInterface {
  name = 'CreatePurchaseHistory1719971652894';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "purchase_history" (
        "id" UUID DEFAULT uuid_generate_v4(),
        "user_id" UUID NOT NULL,
        "product_id" UUID NOT NULL,
        "hash_power" integer,
        "duration" integer,
        "daily_income" bigint,
        "monthly_income" bigint,
        "price" double(10,2),
        "status" smallint,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_1031171c13130102495201e3e21" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "purchase_history"`);
  }
}
