import { User } from '../../users/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userFactory = await factoryManager.get(User);
    try {
      // Save multiple entities
      const users = await userFactory.saveMany(2);
      console.log('Saved users:', users);
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }
}

// const repository = dataSource.getRepository(User);
//     console.log(repository);
//     const result = await repository.insert([
//       {
//         username: 'seed10',
//         password: '1212rewQ@',
//         name: 'seedTest',
//         email: 'seed0987@gmail.com',
//       },
//     ]);
//     console.log(result);
