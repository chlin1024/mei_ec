import { FinancialStatus, FulfillmentStatus } from '../orderStatus.enum';

export class OrderDto {
  admin: number;
  guest: number;
  address: string;
  financialStatus: FinancialStatus;
  fulfillmentStatus: FulfillmentStatus;
  note?: string;
  orderItems: string; //這邊使用OrderItemDto[]有問題
}

export class OrderItemDto {
  product: number; //product id
  quantity: number;
}
