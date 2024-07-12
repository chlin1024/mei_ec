import { PartialType } from '@nestjs/mapped-types';
import { ProductDto } from './product.dto';

export class QueryProductDto extends PartialType(ProductDto) {
  orderBy: string;
  page: number;
  limit: number;
}
