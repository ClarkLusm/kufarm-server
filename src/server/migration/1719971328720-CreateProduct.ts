import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProduct1719971328720 implements MigrationInterface {
  name = 'CreateProduct1719971328720';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "product" (
        "id" UUID DEFAULT uuid_generate_v4(),
        "name" VARCHAR NOT NULL,
        "alias" VARCHAR NOT NULL,
        "image" VARCHAR,
        "hash_power" NUMERIC(10,2),
        "max_out" INTEGER,
        "daily_income" NUMERIC(10,2),
        "monthly_income" NUMERIC(10,2),
        "price" NUMERIC(10,2),
        "sale_price" NUMERIC(10,2),
        "published" BOOLEAN DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_1054171c13130102495201d3e24" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE product`);
  }
}
