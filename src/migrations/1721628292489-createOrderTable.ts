import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderTable1721391298449 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TYPE financial_status AS ENUM ('padding', 'paid', 'refund');
        CREATE TYPE fulfillment_status AS ENUM ('padding', 'fulfilled', 'sale_return');
    `);
    await queryRunner.query(`
            CREATE TABLE "order"(
            "id" SERIAL PRIMARY KEY,
            "adminId" INT NOT NULL,
            "guestId" INT NOT NULL,
            "address" VARCHAR(255) NOT NULL,
            "note" VARCHAR(255),
            "financialStatus" financial_status DEFAULT 'padding',
            "fulfillmentStatus" fulfillment_status DEFAULT 'padding',
            "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            "deletedAt" TIMESTAMP DEFAULT NULL,
            CONSTRAINT "fk_admin" FOREIGN KEY ("adminId") REFERENCES "user" ("id"),
            CONSTRAINT "fk_guest" FOREIGN KEY ("guestId") REFERENCES "user" ("id")  
            );
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE "order"
      `);
  }
}
