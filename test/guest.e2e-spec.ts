import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { seedDatabase } from '../src/database/seeds/seedRunner';
import { clearDatabase } from '../src/database/clearDatabase';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const GUESTS_ORDERS_URL = '/guests/orders';
  beforeAll(async () => {
    await clearDatabase();
  });

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

  afterAll(async () => {
    await app.close();
  });

  let token: string;
  it('should login ', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'guest1234',
        password: '1234rewQ@',
      })
      .expect(201);
    token = loginResponse.body.token;
  });

  it('should return personal info', () => {
    return request(app.getHttpServer())
      .get(GUESTS_ORDERS_URL)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
    //測username equal登入的username
  });

  it('should return 401 for no token', () => {
    return request(app.getHttpServer()).get(GUESTS_ORDERS_URL).expect(401);
  });

  it('should return order 1 info', async () => {
    const response = await request(app.getHttpServer())
      .get(`${GUESTS_ORDERS_URL}/1`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
    expect(response.body.id).toEqual(1);
  });

  it('should return 401 when not user order', async () => {
    return await request(app.getHttpServer())
      .get(`${GUESTS_ORDERS_URL}/2`)
      .set('Authorization', 'Bearer ' + token)
      .expect(401);
  });
});
