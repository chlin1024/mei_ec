import { UsersFactory } from './src/database/factories/user.factory';
import UserSeeder from './src/database/seeds/user.seed';
import { DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import * as dotenv from 'dotenv';
import ProductSeeder from './src/database/seeds/product.seed';
import { ProductFactory } from './src/database/factories/product.factory';
import OrderSeeder from './src/database/seeds/order.seed';
import { OrderFactory } from './src/database/factories/order.factory';
import { OrderItemFactory } from './src/database/factories/orderItem.factor';
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
  seeds: [UserSeeder, ProductSeeder, OrderSeeder],
  factories: [UsersFactory, ProductFactory, OrderFactory, OrderItemFactory],
  // seeds: ['/src/database/seeds/*.seed.{.ts,.js}'],
  // factories: ['/src/database/factories/*.factory.{.ts,.js}'],
};

export default databaseOptions;
