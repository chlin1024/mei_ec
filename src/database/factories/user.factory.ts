import { Faker } from '@faker-js/faker';
import { User } from '../../users/user.entity';
import { setSeederFactory } from 'typeorm-extension';
import * as bcrypt from 'bcrypt';

export const UsersFactory = setSeederFactory(User, async (faker: Faker) => {
  const salt = await bcrypt.genSalt();
  const password = faker.internet.password();
  const hashPassword = await bcrypt.hash(password, salt);
  const name = faker.person.firstName();
  const user = new User();
  user.username = faker.internet.userName({ firstName: name });
  user.password = hashPassword;
  user.name = name;
  user.email = faker.internet.email({ firstName: name });
  return user;
});
//
