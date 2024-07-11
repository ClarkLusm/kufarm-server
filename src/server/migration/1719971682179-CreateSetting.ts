import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSetting1719971682179 implements MigrationInterface {
  name = 'CreateSetting1719971682179';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "setting" (
        "id" UUID DEFAULT uuid_generate_v4(),
        "name" VARCHAR NOT NULL,
        "key" VARCHAR NOT NULL,
        "value" JSONB,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_1032471c25250102495201e3e26" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "setting"`);
  }
}
