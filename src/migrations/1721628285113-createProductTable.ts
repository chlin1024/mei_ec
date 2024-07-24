import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductTable1721628285113 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "product" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR(255) NOT NULL,
                "description" VARCHAR(255),
                "price" DECIMAL(10, 2) NOT NULL,
                "inStock" INTEGER,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "deletedAt" TIMESTAMP DEFAULT NULL
              )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE "product"
      `);
  }
}
