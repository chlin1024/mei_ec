import { runSeeders } from 'typeorm-extension';
//import databaseOptions from '../../../dataSource.config';
import { DataSource } from 'typeorm';
// import { UsersFactory } from '../factories/user.factory';
// import UserSeeder from '../seeds/user.seed';
// import { User } from '../../users/user.entity';
// import { LoginSession } from '../../auth/loginSession.entity';
import * as dotenv from 'dotenv';
import databaseOptions from '../../../dataSource.config';
dotenv.config();

(async () => {
  try {
    const dataSource = new DataSource(databaseOptions);
    await dataSource.initialize();
    await runSeeders(dataSource);
  } catch (error) {
    console.log(error);
  }
})();
