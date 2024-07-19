import { MigrationInterface, QueryRunner } from 'typeorm';

export class Test1721363046467 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "email" TO "email_add"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "email_add" TO "email"`,
    );
  }
}
