import { MigrationInterface, QueryRunner } from 'typeorm';

export class Testing1721362897169 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" RENAME COLUMN "price" TO "price1"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" RENAME COLUMN "price1" TO "price"`,
    );
  }
}
