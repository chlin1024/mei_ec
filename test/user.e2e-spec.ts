import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { User } from 'src/users/user.entity';
//import { clearDatabase } from './../src/database/clearDatabase';
import { seedDatabase } from '../src/database/seeds/seedRunner';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  const USERS_URL = '/users';

  beforeAll(async () => {
    await seedDatabase();
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  let adminToken: string;
  beforeAll(async () => {
    const adminLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin1234', password: '1234rewQ@' })
      .expect(201);
    adminToken = adminLoginResponse.body.token;
  });

  const testUsername = 'testUser1234';

  afterAll(async () => {
    await app.close();
  });

  it('should create a new user', () => {
    return request(app.getHttpServer())
      .post(USERS_URL)
      .send({
        username: testUsername,
        password: '1234rewQ@',
        name: 'Guest93',
        email: 'Testing0987@gmail.com',
      })
      .expect(201);
  });

  it('should return 400 when username is invalid', () => {
    return request(app.getHttpServer())
      .post(USERS_URL)
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
      .post(USERS_URL)
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
      .post(USERS_URL)
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
      .post(USERS_URL)
      .send({
        username: 'test1234',
        password: '12349rew',
        name: 'test',
        email: 'test12349gmail.com',
      })
      .expect(400);
  });

  it('should return 409 for duplicate username', () => {
    return request(app.getHttpServer())
      .post(USERS_URL)
      .send({
        username: 'admin1234',
        password: '12349rewQ@',
        name: 'testing12349',
        email: 'Test12349@gmail.com',
      })
      .expect(409);
  });

  let guestToken: string;
  it('should login ', async () => {
    const guestLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: testUsername, password: '1234rewQ@' })
      .expect(201);
    guestToken = guestLoginResponse.body.token;
  });

  it('should update user info ', () => {
    return request(app.getHttpServer())
      .patch(USERS_URL)
      .set('Authorization', 'Bearer ' + guestToken)
      .send({
        name: 'nameChange',
      })
      .expect(200);
  });

  it('should delete user ', () => {
    return request(app.getHttpServer())
      .delete(`${USERS_URL}`)
      .set('Authorization', 'Bearer ' + guestToken)
      .expect(200);
  });

  it('should return all users', async () => {
    return request(app.getHttpServer())
      .get(USERS_URL)
      .query({ limit: 2 })
      .set('Authorization', 'Bearer ' + adminToken)
      .expect(200);
  });

  it('should return users, name matches "en"', async () => {
    const response = await request(app.getHttpServer())
      .get(USERS_URL)
      .query({ name: 'en', limit: 2 })
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((user: User) => {
      expect(user.name.toLowerCase()).toContain('en');
    });
  });

  it('should return users, email  matches "@gmail"', async () => {
    const response = await request(app.getHttpServer())
      .get(USERS_URL)
      .query({ email: '@gmail', limit: 2 })
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((user: User) => {
      expect(user.email.toLowerCase()).toContain('@gmail');
    });
  });

  it('should order users by "email:desc"', async () => {
    const response = await request(app.getHttpServer())
      .get(USERS_URL)
      .query({ orderBy: 'email:desc', limit: 3 })
      .set('Authorization', 'Bearer ' + adminToken);
    const users = response.body;
    const emails = users.map((user) => user.email);
    const sorted = [...emails].sort((a, b) => b.localeCompare(a));
    expect(emails).toEqual(sorted);
    expect(response.status).toBe(200);
  });

  it('should paginate users', async () => {
    const response = await request(app.getHttpServer())
      .get(USERS_URL)
      .query({ page: 1, limit: 3 })
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toBe(200);
    expect(response.body.length).toBeLessThanOrEqual(3);
  });

  it('should return an empty array when no users match', async () => {
    const response = await request(app.getHttpServer())
      .get(USERS_URL)
      .query({ name: 'jh' })
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
