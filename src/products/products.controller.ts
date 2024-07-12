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
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';
import { QueryProductDto } from './dto/queryProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { UpdateResult } from 'typeorm';
import { JwtGuard } from 'src/auth/guard/jwtAuthentication.guard';
import { RolesGuard } from 'src/roles.guard';
import { Roles } from 'src/roles.decorator';
import { UserRoles } from 'src/users/userRole.enum';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getProduct(@Query() queryProductDto: QueryProductDto) {
    console.log(queryProductDto);
    return this.productsService.getProducts(queryProductDto);
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('create')
  createUser(@Body() productDto: ProductDto): object {
    return this.productsService.createProduct(productDto);
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Put('update/:id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<UpdateResult> {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete('delete/:id')
  deleteUserById(@Param('id', ParseIntPipe) id: number): Promise<UpdateResult> {
    return this.productsService.deleteProductById(id);
  }
}
