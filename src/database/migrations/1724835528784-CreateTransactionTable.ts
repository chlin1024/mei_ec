import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTransactionTable1724835528784 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE checkout_status AS ENUM ('checkout', 'refund');
        `);
    await queryRunner.query(`
            CREATE TABLE "transaction"(
            "id" SERIAL PRIMARY KEY,
            "orderId" INT NOT NULL,
            "checkoutStatus" checkout_status DEFAULT 'checkout',
            "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            "refundAt" TIMESTAMP DEFAULT NULL,
            CONSTRAINT "fk_order" FOREIGN KEY ("orderId") REFERENCES "order" ("id")
            );
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE "transaction"
      `);

    await queryRunner.query(`
        DROP TYPE checkout_status;
      `);
  }
}
