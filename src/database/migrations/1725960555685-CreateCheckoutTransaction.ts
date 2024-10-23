import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCheckoutTransaction1725960555685
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "checkout_transaction" (
          "id" SERIAL PRIMARY KEY,
          "amount" DECIMAL(10, 2) NOT NULL,
          "order_id" INTEGER UNIQUE,
          "checkedoutAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "fk_order" FOREIGN KEY ("order_id") REFERENCES "order" ("id") ON DELETE CASCADE
        );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "checkout_transaction";`);
  }
}
