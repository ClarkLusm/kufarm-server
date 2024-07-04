import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1619278600863 implements MigrationInterface {
  name = 'CreateUsers1619278600863';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "user" (
        "id" UUID DEFAULT uuid_generate_v4(),
        "btc_address" varchar,
        "username" varchar NOT NULL,
        "password_hash" varchar NOT NULL,
        "hash" varchar NOT NULL,
        "email_verified" BOOLEAN DEFAULT false,
        "balance" bigint,
        "referral_balance" bigint,
        "count_referral" integer DEFAULT 0,
        "referral_by" UUID,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
