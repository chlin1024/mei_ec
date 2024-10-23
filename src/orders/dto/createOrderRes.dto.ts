import { FinancialStatus, FulfillmentStatus } from '../orderStatus.enum';

export class createOrederResDto {
  guestInfo: {
    name: string;
    address: string;
  };
  orderInfo: {
    adminId: number;
    guestId: number;
    address: string;
    financialStatus: FinancialStatus;
    fulfillmentStatus: FulfillmentStatus;
    note?: string;
  };
}
