import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const port = parseInt(process.env.DATABASE_PORT) || 5432;
export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: port,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB,
  entities: [__dirname + '/src/**/*.entity.{ts,js}'],
  migrations: [__dirname + '/src/**/migrations/*.ts'],
  synchronize: false,
});
