import { runSeeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import databaseOptions from '../../../dataSource.config';
import UserSeeder from './user.seed';
import ProductSeeder from './product.seed';
import OrderSeeder from './order.seed';

dotenv.config();

export async function seedDatabase() {
  try {
    const dataSource = new DataSource(databaseOptions);
    await dataSource.initialize();
    await runSeeder(dataSource, UserSeeder);
    console.log('使用者創 使用者創 使用者創 使用者創 使用者創 使用者創');
    await runSeeder(dataSource, ProductSeeder);
    console.log('商品創 商品創 商品創 商品創 商品創 商品創');
    await runSeeder(dataSource, OrderSeeder);
    console.log('訂單創 訂單創 訂單創 訂單創 訂單創 訂單創 訂單創 訂單創');
    //await runSeeders(dataSource);
  } catch (error) {
    console.log(error);
  }
}
