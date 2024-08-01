import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

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

  let token: string;
  it('should login ', async () => {
    const guestLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'test1234',
        password: '1234rewQ@',
      })
      .expect(201);
    token = guestLoginResponse.body.token;
  });

  // it('should log in', () => {
  //   return request(app.getHttpServer())
  //     .post('/auth/login')
  //     .send({
  //       username: 'test1234',
  //       password: '1234rewQ@',
  //     })
  //     .expect(201);
  // });

  it('should retun 400 when username is invalid', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 12,
        password: '1234rewQ@',
      })
      .expect(400);
  });

  it('should retun 400 when password is invalid', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'test1234',
        password: '1234rew',
      })
      .expect(400);
  });

  it('should retun 401 when password does not match', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'test1234',
        password: '1234rewQ%&&&&&&&&&&',
      })
      .expect(401);
  });

  it('should retun 404 when username not exsist', () => {
    console.log(token);
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'test6666',
        password: '1234rewQ@',
      })
      .expect(404);
  });

  it('should revoke session', () => {
    return request(app.getHttpServer())
      .patch('/auth/logout')
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
  });
});
