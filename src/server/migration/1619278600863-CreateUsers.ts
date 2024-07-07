import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1619278600863 implements MigrationInterface {
  name = 'CreateUsers1619278600863';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "user" (
        "id" UUID DEFAULT uuid_generate_v4(),
        "username" VARCHAR NOT NULL,
        "email" VARCHAR NOT NULL,
        "btc_address" VARCHAR,
        "password_hash" VARCHAR NOT NULL,
        "salt" VARCHAR NOT NULL,
        "email_verified" BOOLEAN DEFAULT false,
        "balance" bigint,
        "referral_balance" bigint,
        "count_referral" integer DEFAULT 0,
        "referral_by" UUID,
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
