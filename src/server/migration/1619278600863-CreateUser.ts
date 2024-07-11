import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1619278600863 implements MigrationInterface {
  name = 'CreateUser1619278600863';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "user" (
        "id" SERIAL,
        "uid" UUID DEFAULT uuid_generate_v4(),
        "username" VARCHAR NOT NULL,
        "email" VARCHAR NOT NULL,
        "btc_address" VARCHAR,
        "password_hash" VARCHAR NOT NULL,
        "salt" VARCHAR NOT NULL,
        "email_verified" BOOLEAN DEFAULT false,
        "balance" BIGINT,
        "referral_by" INTEGER,
        "referral_path" VARCHAR,
        "referral_balance" NUMERIC(10,2) DEFAULT 0,
        "referral_income" NUMERIC(10,2) DEFAULT 0,
        "count_referral" INTEGER DEFAULT 0,
        "banned" BOOLEAN DEFAULT false,
        "ban_reason" VARCHAR,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_cace4a762ff9f2512dd42373760" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
