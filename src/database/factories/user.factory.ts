import { Faker } from '@faker-js/faker';
import { User } from '../../users/user.entity';
import { setSeederFactory } from 'typeorm-extension';
//import * as bcrypt from 'bcrypt';

export const UsersFactory = setSeederFactory(User, (faker: Faker) => {
  // const salt = await bcrypt.genSalt();
  // const password = faker.internet.password();
  // const hashPassword = await bcrypt.hash(password, salt);
  const user = new User();
  user.username = faker.internet.userName();
  user.password = faker.internet.password();
  //   { pattern: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}/, }
  user.name = faker.person.firstName();
  user.email = faker.internet.email();
  return user;
});
//
