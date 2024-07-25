import { runSeeders } from 'typeorm-extension';
import databaseOptions from '../../../dataSource.config';
import { DataSource } from 'typeorm';
import { UsersFactory } from '../factories/user.factory';
import UserSeeder from '../seeds/user.seed';

(async () => {
  try {
    const dataSource = new DataSource(databaseOptions);
    await dataSource.initialize();
    await runSeeders(dataSource, {
      seeds: [UserSeeder],
      factories: [UsersFactory],
    });
  } catch (error) {
    console.log(error);
  }
})();
