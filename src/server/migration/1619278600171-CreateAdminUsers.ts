import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdminUsers1619278600171 implements MigrationInterface {
  name = 'CreateAdminUsers1619278600171';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "admin_user" (
        "id" UUID DEFAULT uuid_generate_v4(),
        "username" varchar NOT NULL,
        "password_hash" varchar NOT NULL,
        "hash" varchar NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
      );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "admin_user"`);
  }
}
