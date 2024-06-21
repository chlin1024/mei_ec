import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '',
  database: 'mei',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};

//__dirname + '/../**/*.entity.ts'
