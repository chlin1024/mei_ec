import databaseOptions from 'dataSource.config';
import { DataSource } from 'typeorm';

const testDataSource = new DataSource(databaseOptions);

export async function clearDatabase() {
  try {
    await testDataSource.initialize();
    await testDataSource.dropDatabase();
    await testDataSource.synchronize(true);
    await testDataSource.destroy();
  } catch (error) {
    console.log(error);
  }
}
