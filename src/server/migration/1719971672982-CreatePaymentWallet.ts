import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentWallet1719971672982 implements MigrationInterface {
  name = 'CreatePaymentWallet1719971672982';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "payment_wallet" (
        "id" UUID DEFAULT uuid_generate_v4(),
        "is_out" BOOLEAN DEFAULT false,
        "name" VARCHAR NOT NULL,
        "chain_id" SERIAL,
        "wallet_address" VARCHAR(42) NOT NULL,
        "secret" VARCHAR(255),
        "coin" VARCHAR(10),
        "image" VARCHAR(255),
        "published" BOOLEAN DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_1032471c13130102495201e3e26" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "payment_wallet"`);
  }
}
