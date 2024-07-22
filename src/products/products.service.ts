import { Injectable } from '@nestjs/common';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDto } from './dto/product.dto';
import { QueryProductDto } from './dto/queryProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

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
    //console.log(name, price, description, inStock);
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
      // order = {
      //   [orderColumn]: orderType,
      // };
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
    const result = await query
      .softDelete()
      .where('product.id = :id', { id })
      .execute();
    return result;
  }
}
