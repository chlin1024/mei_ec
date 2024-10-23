import { FinancialStatus, FulfillmentStatus } from '../orderStatus.enum';

export class OrderDto {
  adminId: number;
  guestId: number;
  address: string;
  financialStatus: FinancialStatus;
  fulfillmentStatus: FulfillmentStatus;
  note?: string;
  orderItems: OrderItemDto[];
}

export class OrderItemDto {
  productId: number; //product id
  quantity: number;
  selling_price: number;
}

export class OrderInfoDto extends OrderDto {
  orderId: number;
}
