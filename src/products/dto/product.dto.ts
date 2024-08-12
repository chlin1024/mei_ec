import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  price: number;

  description?: string;

  @IsNumber()
  @Type(() => Number)
  inStock: number;
}
