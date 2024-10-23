import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderTransaction1725960597026 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "order_transaction" (
          "id" SERIAL PRIMARY KEY,
          "order_id" INTEGER NOT NULL,
          "checkout_transaction_id" INTEGER,
          "refund_transaction_id" INTEGER,
          CONSTRAINT "fk_order" FOREIGN KEY ("order_id") REFERENCES "order" ("id") ON DELETE CASCADE,
          CONSTRAINT "fk_checkout_transaction" FOREIGN KEY ("checkout_transaction_id") REFERENCES "checkout_transaction" ("id") ON DELETE CASCADE,
          CONSTRAINT "fk_refund_transaction" FOREIGN KEY ("refund_transaction_id") REFERENCES "refund_transaction" ("id") ON DELETE CASCADE
        );
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "order_transaction";`);
  }
}
