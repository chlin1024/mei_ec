import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';
import { QueryProductDto } from './dto/queryProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { UpdateResult } from 'typeorm';
import { JwtGuard } from '../auth/guard/jwtAuthentication.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRoles } from '../users/userRole.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponses } from 'src/utils/decorator/api-response.decorator.';

@ApiTags('products')
@ApiErrorResponses()
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getProduct(@Query() queryProductDto: QueryProductDto) {
    return this.productsService.getProducts(queryProductDto);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(UserRoles.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  createUser(@Body() productDto: ProductDto): object {
    return this.productsService.createProduct(productDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(UserRoles.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<UpdateResult> {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(UserRoles.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  deleteUserById(@Param('id', ParseIntPipe) id: number): Promise<UpdateResult> {
    return this.productsService.deleteProductById(id);
  }
}
