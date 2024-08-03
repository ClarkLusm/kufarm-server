import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrder1719971652894 implements MigrationInterface {
  name = 'CreateOrder1719971652894';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "order" (
        "id" UUID DEFAULT uuid_generate_v4(),
        "code" VARCHAR NOT NULL,
        "wallet_address" VARCHAR(42) NOT NULL,
        "user_id" UUID,
        "product_id" UUID,
        "quantity" SMALLINT,
        "amount" NUMERIC(38),
        "coin" VARCHAR(10) NOT NULL,
        "status" SMALLINT DEFAULT 0,
        "expired_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_1031171c13130102495201e3e30" PRIMARY KEY ("id"),
        CONSTRAINT "FK_1031171c13130102495201e3e31" FOREIGN KEY (user_id) REFERENCES "user" (id),
        CONSTRAINT "FK_1031171c13130102495201e3e32" FOREIGN KEY (product_id) REFERENCES "product" (id)
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "order"`);
  }
}
