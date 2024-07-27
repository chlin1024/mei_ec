import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { User } from 'src/users/user.entity';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  const CREATE_USER_URL = '/users/signup';
  const GET_USERS_URL = '/users';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // it('should create a new user', () => {
  //   return request(app.getHttpServer())
  //     .post(CREATE_USER_URL)
  //     .send({
  //       username: 'test1234',
  //       password: '1234rewQ@',
  //       name: 'test',
  //       email: 'Test0987@gmail.com',
  //     })
  //     .expect(201);
  // });

  it('should return 400 when username is invalid', () => {
    return request(app.getHttpServer())
      .post(CREATE_USER_URL)
      .send({
        username: 'dds',
        password: '12349rewQ$',
        name: 'testing123',
        email: 'Test12349@gmail.com',
      })
      .expect(400);
  });

  it('should return 400 when password is invalid', () => {
    return request(app.getHttpServer())
      .post(CREATE_USER_URL)
      .send({
        username: 'test1234',
        password: '12349rew',
        name: 'testing123',
        email: 'Test12349@gmail.com',
      })
      .expect(400);
  });

  it('should return 400 when name is empty', () => {
    return request(app.getHttpServer())
      .post(CREATE_USER_URL)
      .send({
        username: 'test1234',
        password: '12349rew',
        name: '',
        email: 'test12349@gmail.com',
      })
      .expect(400);
  });

  it('should return 400 when email format is invalid', () => {
    return request(app.getHttpServer())
      .post(CREATE_USER_URL)
      .send({
        username: 'test1234',
        password: '12349rew',
        name: 'test',
        email: 'test12349gmail.com',
      })
      .expect(400);
  });

  // it('should return 409 for duplicate username', () => {
  //   return request(app.getHttpServer())
  //     .post(CREATE_USER_URL)
  //     .send({
  //       username: 'test12349',
  //       password: '12349rewQ@',
  //       name: 'testing12349',
  //       email: 'Test12349@gmail.com',
  //     })
  //     .expect(409);
  // });

  // GET /users
  it('should return all users', () => {
    return request(app.getHttpServer()).get(GET_USERS_URL).expect(200);
  });

  it('should return users, name matches "en"', async () => {
    const response = await request(app.getHttpServer())
      .get(GET_USERS_URL)
      .query({ name: 'en' });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((user: User) => {
      expect(user.name.toLowerCase()).toContain('en');
    });
  });

  it('should return users, email  matches "@gmail"', async () => {
    const response = await request(app.getHttpServer())
      .get(GET_USERS_URL)
      .query({ email: '@gmail' });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((user: User) => {
      expect(user.email.toLowerCase()).toContain('@gmail');
    });
  });

  it('should order users by "email:desc"', async () => {
    const response = await request(app.getHttpServer())
      .get(GET_USERS_URL)
      .query({ orderBy: 'email:desc' });
    const users = response.body;
    const emails = users.map((user) => user.email);
    const sorted = [...emails].sort((a, b) => b.localeCompare(a));
    expect(emails).toEqual(sorted);
    expect(response.status).toBe(200);
  });

  it('should paginate users', async () => {
    const response = await request(app.getHttpServer())
      .get(GET_USERS_URL)
      .query({ page: 1, limit: 3 });
    expect(response.status).toBe(200);
    expect(response.body.length).toBeLessThanOrEqual(3);
  });

  it('should return an empty array when no users match', async () => {
    const response = await request(app.getHttpServer())
      .get(GET_USERS_URL)
      .query({ name: 'jh' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
