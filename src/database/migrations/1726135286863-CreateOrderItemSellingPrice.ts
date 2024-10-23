import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderItemSellingPrice1726135286863
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE Order_item
        ADD COLUMN selling_price DECIMAL(10, 2) NOT NULL DEFAULT 0;
    `);

    await queryRunner.query(`
        UPDATE Order_item
        SET selling_price = (
            SELECT p.sale_price
            FROM Product p
            WHERE p.id = Order_item."productId"
            );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE Order_item
        DROP COLUMN selling_price;
    `);
  }
}
