import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRefundTransaction1725960573643
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "refund_transaction" (
          "id" SERIAL PRIMARY KEY,
          "amount" DECIMAL(10, 2) NOT NULL,
          "order_id" INTEGER UNIQUE,
          "refundedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "fk_order" FOREIGN KEY ("order_id") REFERENCES "order" ("id") ON DELETE CASCADE
        );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "refund_transaction";`);
  }
}
