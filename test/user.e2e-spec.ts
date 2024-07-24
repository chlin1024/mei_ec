import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  const CREATE_USER_URL = '/users/signup';

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
  //       username: 'test0987',
  //       password: '1212rewQ@',
  //       name: 'test',
  //       email: 'test0987@gmail.com',
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
        email: 'test12349@gmail.com',
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
        email: 'test12349@gmail.com',
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

  it('should return 409 for duplicate username', () => {
    return request(app.getHttpServer())
      .post(CREATE_USER_URL)
      .send({
        username: 'test12349',
        password: '12349rewQ@',
        name: 'testing12349',
        email: 'test12349@gmail.com',
      })
      .expect(409);
  });
});
