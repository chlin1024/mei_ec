import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDto } from './dto/product.dto';
import { QueryProductDto } from './dto/queryProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async createProduct(productDto: ProductDto) {
    const productDraft = await this.productsRepository.create(productDto);
    return await this.productsRepository.insert(productDraft);
  }

  async getProducts(queryProductDto: QueryProductDto) {
    const { page, limit, name, price, description, inStock, orderBy } =
      queryProductDto;
    const query = this.productsRepository.createQueryBuilder('product');
    query.andWhere('product.deletedAt IS NULL');
    if (price) {
      query.andWhere('product.price = :price', { price });
    }
    if (inStock) {
      query.andWhere('product.inStock = :inStock', { inStock });
    }

    if (name) {
      query.andWhere('product.name LIKE :name', { name: `%${name}%` });
    }
    if (description) {
      query.andWhere('product.description LIKE :description', {
        description: `%${description}%`,
      });
    }

    if (orderBy) {
      const cleanOrderBy = orderBy.replace(/^'|'$/g, '');
      const orderColumn = cleanOrderBy.split(':')[0];
      const orderType = cleanOrderBy.split(':')[1].toUpperCase() as
        | 'ASC'
        | 'DESC';

      query.orderBy(orderColumn, orderType);
    }

    if (page && limit) {
      query.skip((page - 1) * limit).take(limit);
    }

    const products = await query.getMany();
    return products;
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    return await this.productsRepository.update(id, {
      ...updateProductDto,
    });
  }

  async deleteProductById(id: number) {
    const query = this.productsRepository.createQueryBuilder('product');
    const productExist = await query.where('product.id = :id', { id }).getOne();
    if (!productExist) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const result = await query
      .softDelete()
      .where('product.id = :id', { id })
      .execute();
    return result;
  }

  async getProductPrice(id: number) {
    const query = this.productsRepository.createQueryBuilder('product');
    const productPrice = await query
      .where('product.id = :id', { id })
      .select('product.sale_price')
      .getOne();
    console.log(productPrice);
    return productPrice.sale_price;
  }

  async applyProductDiscount(discountRate: number) {
    const products = await this.getProducts({});
    for (const product of products) {
      const discountPrice = product.price * discountRate;
      await this.updateProduct(product.id, {
        sale_price: discountPrice,
      });
    }
  }

  async restoreProductPrice() {
    const products = await this.getProducts({});
    for (const product of products) {
      await this.updateProduct(product.id, {
        sale_price: product.price,
      });
    }
  }

  @Cron('0 14 * * * *')
  handleDiscount() {
    this.applyProductDiscount(0.9);
  }

  @Cron('0 9 * * * *')
  handleCron() {
    this.restoreProductPrice();
  }
}
