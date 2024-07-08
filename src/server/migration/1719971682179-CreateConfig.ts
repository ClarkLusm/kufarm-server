import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConfig1719971682179 implements MigrationInterface {
  name = 'CreateConfig1719971682179';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "config" (
        "id" UUID DEFAULT uuid_generate_v4(),
        "name" VARCHAR NOT NULL,
        "key" VARCHAR NOT NULL,
        "value" VARCHAR,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_1032471c13130102495201e3e26" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "config"`);
  }
}
