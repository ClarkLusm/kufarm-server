import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentAccount1719971674211 implements MigrationInterface {
  name = 'CreatePaymentAccount1719971674211';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "payment_account" (
        "id" UUID DEFAULT uuid_generate_v4(),
        "payment_wallet_id" UUID,
        "account_address" VARCHAR(42) NOT NULL,
        "balance" NUMERIC(38),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_1032471c13130102494211e3e26" PRIMARY KEY ("id"),
        CONSTRAINT "PK_1032471c13130102494211e3e27" FOREIGN KEY ("payment_wallet_id") REFERENCES "payment_wallet" (id)
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "payment_account"`);
  }
}
