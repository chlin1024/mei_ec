import { UsersFactory } from './src/database/factories/user.factory';
import UserSeeder from './src/database/seeds/user.seed';
import { DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import * as dotenv from 'dotenv';
dotenv.config();

const port = parseInt(process.env.DATABASE_PORT) || 5432;
const databaseOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: port,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB,
  entities: [__dirname + '/src/**/*.entity.{ts,js}'],
  migrations: [__dirname + '/src/database/**/migrations/*.ts'],
  synchronize: false,
  seeds: [UserSeeder],
  factories: [UsersFactory],
  // seeds: [__dirname + '/src/database/seeds/*.seed.{.ts,.js}'],
  // factories: [__dirname + '/src/database/factories/*.factory.{.ts,.js}'],
};

export default databaseOptions;
