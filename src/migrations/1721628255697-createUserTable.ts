import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1721628255697 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL PRIMARY KEY,
                "username" VARCHAR NOT NULL UNIQUE,
                "password" VARCHAR NOT NULL,
                "name" VARCHAR NOT NULL,
                "email" VARCHAR NOT NULL,
                "role" VARCHAR NOT NULL DEFAULT 'GUEST',
                "deletedAt" TIMESTAMP,
                CONSTRAINT "CHK_role_enum" CHECK ("role" IN ('GUEST', 'ADMIN', 'USER'))
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE "user"
    `);
  }
}
