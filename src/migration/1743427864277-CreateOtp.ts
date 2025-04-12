import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOtp1743427864277
  implements MigrationInterface
{
  name = 'CreateOtp1743427864277';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "otp" (
        "id" UUID DEFAULT uuid_generate_v4(),
        "user_id" UUID,
        "otp_code" VARCHAR(8) NOT NULL,
        "expired_at" TIMESTAMP NOT NULL,
        "type" SMALLINT,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_1081260c13130102495201d3d77" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "otp"`);
  }
}
