import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWalletTransactions1719971311936
  implements MigrationInterface
{
  name = 'CreateWalletTransactions1719971311936';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "wallet_transaction" (
        "id" UUID DEFAULT uuid_generate_v4(),
        "user_id" UUID NOT NULL,
        "type" smallint,
        "wallet_address" varchar NOT NULL,
        "payment_address" varchar NOT NULL,
        "symbol" varchar NOT NULL,
        "amount" bigint,
        "status" smallint,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "wallet_transaction"`);
  }
}
