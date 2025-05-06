import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReinvest1746381891894 implements MigrationInterface {
  name = 'CreateReinvest1746381891894';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "reinvest" (
        "id" UUID DEFAULT uuid_generate_v4(),
        "user_id" UUID,
        "prev_balance_usd" NUMERIC(10,2),
        "prev_referral_commission_usd" NUMERIC(10,2),
        "current_rate" NUMERIC(10,2),
        "amount" NUMERIC(10,2),
        "daily_income" NUMERIC(10,2),
        "monthly_income" NUMERIC(10,2),
        "hash_power" NUMERIC(10,2),
        "max_out" INTEGER,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_1031171c13130102495201e7z21" PRIMARY KEY ("id"),
        CONSTRAINT "FK_1031171c13130102495201e8h22" FOREIGN KEY (user_id) REFERENCES "user" (id),
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "reinvest"`);
  }
}
