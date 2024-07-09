import { PartialType } from '@nestjs/mapped-types';
import { OrderDto } from './order.dto';

export class QueryOrderDto extends PartialType(OrderDto) {
  page: number;
  limit: number;
  orderBy?: string;
}
