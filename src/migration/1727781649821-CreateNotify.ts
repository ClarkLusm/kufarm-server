import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNotify1727781649821
  implements MigrationInterface
{
  name = 'CreateNotify1727781649821';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "notify" (
        "id" UUID DEFAULT uuid_generate_v4(),
        "title" VARCHAR,
        "description" VARCHAR,
        "type" SMALLINT,
        "platform" VARCHAR(10)
        "condition" JSONB,
        "auto" BOOLEAN DEFAULT false,
        "published" BOOLEAN DEFAULT false,
        "start_at" TIMESTAMP,
        "end_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_1081260c13130102495201e3d71" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "notify"`);
  }
}
