import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Product } from '../src/products/product.entity';
import { seedDatabase } from '../src/database/seeds/seedRunner';
import { clearDatabase } from '../src/database/clearDatabase';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const PRODUCTS_URL = '/products';
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
  let token;
  beforeAll(async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin1234', password: '1234rewQ@' })
      .expect(201);
    token = loginResponse.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('get products', () => {
    return request(app.getHttpServer()).get(PRODUCTS_URL).expect(200);
  });

  it('should return name matches "Sala"', async () => {
    const response = await request(app.getHttpServer())
      .get(PRODUCTS_URL)
      .query({ name: 'Sala' });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((product: Product) => {
      expect(product.name.toLowerCase()).toContain('sala');
    });
  });

  it('should return description include "bike"', async () => {
    const response = await request(app.getHttpServer())
      .get(PRODUCTS_URL)
      .query({ description: 'bike' });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((product: Product) => {
      expect(product.description.toLowerCase()).toContain('bike');
    });
  });

  it('should return users, price equals to 67', async () => {
    const response = await request(app.getHttpServer())
      .get(PRODUCTS_URL)
      .query({ price: 67 });
    expect(response.status).toBe(200);
    response.body.forEach((product: Product) => {
      expect(product.price).toEqual(67);
    });
  });

  it('should return products, in stock number equals to 79', async () => {
    const response = await request(app.getHttpServer())
      .get(PRODUCTS_URL)
      .query({ inStock: 79 }); //TODO 用limit設定1去減少資源佔用
    expect(response.status).toBe(200);
    response.body.forEach((product: Product) => {
      expect(product.inStock).toEqual(79);
    });
  });

  it('should return products by "price:desc"', async () => {
    const response = await request(app.getHttpServer())
      .get(PRODUCTS_URL)
      .query({ orderBy: 'price:desc' });
    const products = response.body;
    const prices = products.map((product) => product.prce);
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
    expect(response.status).toBe(200);
  });

  it('should paginate products', async () => {
    const response = await request(app.getHttpServer())
      .get(PRODUCTS_URL)
      .query({ page: 1, limit: 4 });
    expect(response.status).toBe(200);
    expect(response.body.length).toBeLessThanOrEqual(4);
  });

  it('should return an empty array when no products match query', async () => {
    const response = await request(app.getHttpServer())
      .get(PRODUCTS_URL)
      .query({ name: 'jh' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  let createdProductId;
  it('should create a new product', async () => {
    const response = await request(app.getHttpServer())
      .post(PRODUCTS_URL)
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'Pencil B2 test',
        price: 12,
        description: 'Easy to write',
        inStock: 120,
      })
      .expect(201);
    createdProductId = response.body.identifiers[0].id;
  });

  it('should return 400 when name is invalid', () => {
    return request(app.getHttpServer())
      .post(PRODUCTS_URL)
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: '',
        price: 12,
        description: 'Easy to write',
        inStock: 120,
      })
      .expect(400);
  });

  it('should update product info', () => {
    return request(app.getHttpServer())
      .patch(`${PRODUCTS_URL}/${createdProductId}`)
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'New Name',
      })
      .expect(200);
  });
  it('should return 400 update product info price invalid', () => {
    return request(app.getHttpServer())
      .patch(`${PRODUCTS_URL}/${createdProductId}`)
      .set('Authorization', 'Bearer ' + token)
      .send({
        price: 'New Name',
      })
      .expect(400);
  });
  it('should delete product ', () => {
    return request(app.getHttpServer())
      .delete(`${PRODUCTS_URL}/${createdProductId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
  });

  it('should retrun 400 when product does not exsist', () => {
    return request(app.getHttpServer())
      .delete(`${PRODUCTS_URL}/10000000`)
      .set('Authorization', 'Bearer ' + token)
      .expect(404);
  });

  let guestToken: string;
  it('should login ', async () => {
    const guestLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'guest1234',
        password: '1234rewQ@',
      })
      .expect(201);
    guestToken = guestLoginResponse.body.token;
  });
  it('should retrun 403 when bear guest Token', () => {
    return request(app.getHttpServer())
      .post(`${PRODUCTS_URL}`)
      .set('Authorization', 'Bearer ' + guestToken)
      .expect(403);
  });
});
