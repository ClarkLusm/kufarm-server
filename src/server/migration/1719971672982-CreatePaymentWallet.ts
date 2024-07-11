import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentWallet1719971672982 implements MigrationInterface {
  name = 'CreatePaymentWallet1719971672982';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "payment_wallet" (
        "id" UUID DEFAULT uuid_generate_v4(),
        "chain_id" INTEGER,
        "wallet_address" VARCHAR NOT NULL,
        "status" SMALLINT,
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
