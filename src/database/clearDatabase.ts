import databaseOptions from 'dataSource.config';
import { DataSource } from 'typeorm';

const testDataSource = new DataSource(databaseOptions);

export async function clearDatabase() {
  try {
    await testDataSource.initialize();
    await testDataSource.dropDatabase();
    console.log('資料庫drop 資料庫drop 資料庫drop 資料庫drop');
    await testDataSource.synchronize(true);
    console.log('資料庫同步 資料庫同步 資料庫同步 資料庫同步');
    await testDataSource.destroy();
  } catch (error) {
    console.log(error);
  }
}
