import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentWallet1719971672982 implements MigrationInterface {
  name = 'CreatePaymentWallet1719971672982';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "payment_wallet" (
        "id" UUID DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "wallet_address" varchar NOT NULL,
        "exchange_logo" varchar,
        "status" smallint,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_1031171c13130102495201e3e26" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "payment_wallet"`);
  }
}
