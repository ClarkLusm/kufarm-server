import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserProduct1719971671281 implements MigrationInterface {
  name = 'CreateUserProduct1719971671281';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "user_product" (
        "id" UUID DEFAULT uuid_generate_v4(),
        "user_id" UUID,
        "product_id" UUID,
        "max_out" INTEGER DEFAULT 0,
        "income" INTEGER DEFAULT 0,
        "hash_power" INTEGER DEFAULT 0,
        "daily_income" NUMERIC(10,2),
        "monthly_income" NUMERIC(10,2),
        "status" SMALLINT,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_1031171cf3130102495201e3e25" PRIMARY KEY ("id"),
        CONSTRAINT "FK_1031171cf3130102495201e3e26" FOREIGN KEY (user_id) REFERENCES "user" (id),
        CONSTRAINT "FK_1031171cf3130102495201e3e27" FOREIGN KEY (product_id) REFERENCES "product" (id)
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_product"`);
  }
}
