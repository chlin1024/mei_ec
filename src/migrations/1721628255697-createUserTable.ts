import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1721628255697 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE user_role AS ENUM ('admin', 'guest');
  `);
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL PRIMARY KEY,
                "username" VARCHAR NOT NULL UNIQUE,
                "password" VARCHAR NOT NULL,
                "name" VARCHAR NOT NULL,
                "email" VARCHAR NOT NULL,
                "role" user_role DEFAULT 'guest',
                "deletedAt" TIMESTAMP
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE "user"
    `);
  }
}
