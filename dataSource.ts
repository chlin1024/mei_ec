import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import databaseOptions from './dataSource.config';
dotenv.config();

// const port = parseInt(process.env.DATABASE_PORT) || 5432;
// const options: DataSourceOptions & SeederOptions = {
//   type: 'postgres',
//   host: process.env.DATABASE_HOST,
//   port: port,
//   username: process.env.DATABASE_USERNAME,
//   password: process.env.DATABASE_PASSWORD,
//   database: process.env.DATABASE_DB,
//   entities: [__dirname + '/src/**/*.entity.{ts,js}'],
//   migrations: [__dirname + '/src/database/**/migrations/*.ts'],
//   synchronize: false,
//   seeds: [__dirname + '/src/database/seeds/**/*{.ts,.js}'],
//   factories: [__dirname + '/src/database/factories/**/*{.ts,.js}'],
// };

const dataSource = new DataSource(databaseOptions);
export default dataSource;
