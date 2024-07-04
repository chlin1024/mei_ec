import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';
import { QueryProductDto } from './dto/queryProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { UpdateResult } from 'typeorm';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getProduct(@Query() queryProductDto: QueryProductDto) {
    console.log(queryProductDto);
    return this.productsService.getProducts(queryProductDto);
  }

  @Post('create')
  @UsePipes(ValidationPipe)
  createUser(@Body() productDto: ProductDto): object {
    return this.productsService.createProduct(productDto);
  }

  @Put('update/:id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<UpdateResult> {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete('delete/:id')
  deleteUserById(@Param('id', ParseIntPipe) id: number): Promise<UpdateResult> {
    return this.productsService.deleteProductById(id);
  }
}
