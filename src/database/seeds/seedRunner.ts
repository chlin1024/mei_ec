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
    await dataSource.synchronize(true);
    await runSeeder(dataSource, UserSeeder);
    await runSeeder(dataSource, ProductSeeder);
    await runSeeder(dataSource, OrderSeeder);
    //await runSeeders(dataSource);
  } catch (error) {
    console.log(error);
  }
}

//seedDatabase();
