import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderItemTable1721393456346 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "order_item" (
            "id" SERIAL PRIMARY KEY,
            "orderId" INT NOT NULL,
            "productId" INT NOT NULL,
            "quantity" INT NOT NULL,
            "deletedAt" TIMESTAMP DEFAULT NULL,
            CONSTRAINT "fk_order" FOREIGN KEY ("orderId") REFERENCES "order" ("id"),
            CONSTRAINT "fk_product" FOREIGN KEY ("productId") REFERENCES "product" ("id")
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE "order_item"
        `);
  }
}
