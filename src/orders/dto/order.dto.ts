import { FinancialStatus, FulfillmentStatus } from '../orderStatus.enum';

export class OrderDto {
  admin: number;
  guest: number;
  address: string;
  financialStatus: FinancialStatus;
  fulfillmentStatus: FulfillmentStatus;
  note?: string;
  orderItems: OrderItemDto[]; //這邊使用OrderItemDto[]有問題
}

export class OrderItemDto {
  // TODO: 大多都會使用 id 表示，要使用的資料。
  // 1. 可以減少 request 的網路傳輸量。
  // 2. 如果要使用該參數的其他資料會在去 DB 查找一次，因為傳送過來的值不一定正確。
  productId: number;
  quantity: number;
}
