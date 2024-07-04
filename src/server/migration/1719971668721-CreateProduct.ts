import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProduct1719971668721 implements MigrationInterface {
  name = 'CreateProduct1719971668721';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "product" (
        "id" UUID DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "alias" varchar NOT NULL,
        "image" varchar,
        "hash_power" integer,
        "duration" integer,
        "daily_income" bigint,
        "monthly_income" bigint,
        "price" double(10,2),
        "sale_price" double(10,2),
        "status" smallint,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_1031171c13130102495201e3e24" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "product"`);
  }
}
