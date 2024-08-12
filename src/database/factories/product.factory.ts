import { Faker } from '@faker-js/faker';
import { Product } from '../../products/product.entity';
import { setSeederFactory } from 'typeorm-extension';

export const ProductFactory = setSeederFactory(
  Product,
  async (faker: Faker) => {
    const price = faker.commerce.price({
      min: 10,
      max: 2000,
      dec: 0,
    });
    const product = new Product();
    product.name = faker.commerce.productName();
    product.price = parseInt(price);
    product.description = faker.commerce.productDescription();
    product.inStock = faker.number.int({ max: 500 });
    return product;
  },
);
