import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReferralCommission1719971733620
  implements MigrationInterface
{
  name = 'CreateReferralCommission1719971733620';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "referral_commission" (
        "id" UUID DEFAULT uuid_generate_v4(),
        "user_id" UUID,
        "ref_by_user_id" UUID,
        "level" SMALLINT,
        "value" NUMERIC(38),
        "coin" VARCHAR,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_1032471c13130102495201e3d71" PRIMARY KEY ("id"),
        CONSTRAINT "FK_1031171c13130102495201e3d72" FOREIGN KEY (user_id) REFERENCES "user" (id),
        CONSTRAINT "FK_1031171c13130102495201e3d73" FOREIGN KEY (ref_by_user_id) REFERENCES "user" (id)
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "referral_commission"`);
  }
}
