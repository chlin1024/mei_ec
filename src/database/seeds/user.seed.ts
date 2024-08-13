import { UserRoles } from 'src/users/userRole.enum';
import { User } from '../../users/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userFactory = await factoryManager.get(User);
    await userFactory.save({
      id: 1,
      username: 'admin1234',
      role: UserRoles.ADMIN,
    });
    await userFactory.save({ id: 2, username: 'guest1234' });
    await userFactory.save({ id: 3, username: 'guest5678' });
    await userFactory.saveMany(12);
  }
}
