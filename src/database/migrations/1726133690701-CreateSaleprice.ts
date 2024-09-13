import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSaleprice1726133690701 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE Product
        ADD COLUMN sale_price DECIMAL(10, 2) NOT NULL DEFAULT 0 ;
            `);

    await queryRunner.query(`
        UPDATE Product
        SET sale_price = price;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE Product
        DROP COLUMN sale_price;
    `);
  }
}
