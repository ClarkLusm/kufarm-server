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
        "type" SMALLINT,
        "wallet_address" VARCHAR NOT NULL,
        "payment_address" VARCHAR NOT NULL,
        "symbol" VARCHAR NOT NULL,
        "amount" BIGINT,
        "status" SMALLINT,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_1031171c13130102495201e3f20" PRIMARY KEY (id),
        CONSTRAINT "FK_1031171c13130102495201e3f21" FOREIGN KEY (user_id) REFERENCES "user" (id)
      )`,
    );
    await queryRunner.query('CREATE INDEX idx_user ON "wallet_transaction" (user_id)');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "wallet_transaction"`);
  }
}
