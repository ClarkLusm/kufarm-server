import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReinvest1746381891894 implements MigrationInterface {
  name = 'CreateReinvest1746381891894';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "reinvest" (
        "id" UUID DEFAULT uuid_generate_v4(),
        "user_id" UUID,
        "to_usd_rate" NUMERIC(10,2),
        "amount" NUMERIC(10,2),
        "income" NUMERIC(10,2),
        "max_out" NUMERIC(10,2),
        "status" SMALLINT,
        "sync_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_1031171c13130102495201e7z21" PRIMARY KEY ("id"),
        CONSTRAINT "FK_1031171c13130102495201e8h22" FOREIGN KEY (user_id) REFERENCES "user" (id)
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "reinvest"`);
  }
}
