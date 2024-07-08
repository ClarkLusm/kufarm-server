import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePurchaseHistory1719971652894 implements MigrationInterface {
  name = 'CreatePurchaseHistory1719971652894';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "purchase_history" (
        "id" UUID DEFAULT uuid_generate_v4(),
        "user_id" INTEGER NOT NULL,
        "product_id" UUID NOT NULL,
        "hash_power" INTEGER,
        "duration" INTEGER,
        "daily_income" BIGINT,
        "monthly_income" BIGINT,
        "price" NUMERIC(10,2),
        "status" SMALLINT,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_1031171c13130102495201e3e30" PRIMARY KEY ("id"),
        CONSTRAINT "FK_1031171c13130102495201e3e31" FOREIGN KEY (user_id) REFERENCES "user" (id),
        CONSTRAINT "FK_1031171c13130102495201e3e32" FOREIGN KEY (product_id) REFERENCES "product" (id)
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "purchase_history"`);
  }
}
