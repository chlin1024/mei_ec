import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLoginSessionTable1721389206480
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "login_session" (
                "id" SERIAL PRIMARY KEY,
                "token" VARCHAR(255),
                "userId" INTEGER NOT NULL,
                "createdAt" TIMESTAMP NOT NULL,
                "expiredAt" TIMESTAMP NOT NULL,
                "revokedAt" TIMESTAMP,
                CONSTRAINT "FK_user_login_session" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE "login_session"
      `);
  }
}
