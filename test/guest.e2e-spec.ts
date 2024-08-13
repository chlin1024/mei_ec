import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { seedDatabase } from '../src/database/seeds/seedRunner';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const GUESTS_ORDERS_URL = '/guests/orders';

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
  }, 10000);

  const guestUsername = 'guest1234';

  let token: string;
  it('should login ', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: guestUsername,
        password: '1234rewQ@',
      })
      .expect(201);
    token = loginResponse.body.token;
  });

  it('should return personal info', async () => {
    const response = await request(app.getHttpServer())
      .get('/guests/me')
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
    expect(response.body.username).toBe(guestUsername);
  });

  it('should return 401 for no token', async () => {
    return await request(app.getHttpServer())
      .get(GUESTS_ORDERS_URL)
      .expect(401);
  });

  it('should create new order', async () => {
    return await request(app.getHttpServer())
      .post(`${GUESTS_ORDERS_URL}`)
      .set('Authorization', 'Bearer ' + token)
      .send({
        adminId: 1,
        address: '台北市寧夏路89號',
        orderItems: [
          { productId: 6, quantity: 90 },
          { productId: 7, quantity: 5 },
        ],
      })
      .expect(201);
  });

  it(`should return order 11 info`, async () => {
    const response = await request(app.getHttpServer())
      .get(`${GUESTS_ORDERS_URL}/11`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
    expect(response.body.id).toEqual(11);
  });

  it('should return 401 when not user order', async () => {
    return await request(app.getHttpServer())
      .get(`${GUESTS_ORDERS_URL}/1`)
      .set('Authorization', 'Bearer ' + token)
      .expect(401);
  });

  it('should update order 11 address', async () => {
    return await request(app.getHttpServer())
      .patch(`${GUESTS_ORDERS_URL}/11`)
      .set('Authorization', 'Bearer ' + token)
      .send({
        address: '台北市寧夏路10000號',
      })
      .expect(200);
  });

  it('should delete order 11 ', async () => {
    return await request(app.getHttpServer())
      .delete(`${GUESTS_ORDERS_URL}/11`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
  });
});
