import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1619278600863 implements MigrationInterface {
  name = 'CreateUser1619278600863';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "user" (
        "id" UUID DEFAULT uuid_generate_v4(),
        "sid" SERIAL,
        "username" VARCHAR NOT NULL,
        "email" VARCHAR NOT NULL,
        "wallet_address" VARCHAR,
        "password_hash" VARCHAR NOT NULL,
        "salt" VARCHAR NOT NULL,
        "max_out" BIGINT,
        "income" BIGINT,
        "balance_usd" BIGINT,
        "balance_token" BIGINT,
        "referral_by" UUID,
        "referral_path" VARCHAR,
        "referral_commission" BIGINT,
        "email_verified" BOOLEAN DEFAULT false,
        "banned_at" TIMESTAMP,
        "ban_reason" VARCHAR,
        "sync_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_cace4a762ff9f2512dd42373760" PRIMARY KEY ("id")
      );
    `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
