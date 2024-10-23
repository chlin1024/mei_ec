import {
  Controller,
  Get,
  // Param,
  // ParseIntPipe,
  //Post,
  Query,
} from '@nestjs/common';
import { LinePayService } from './line-pay.service';

@Controller('line-pay')
export class LinePayController {
  constructor(private readonly linePayService: LinePayService) {}

  // @Post('checkout')
  // async checkout() {
  //   console.log('結帳');
  //   const response = await this.linePayService.checkout();
  //   return response;
  // }

  @Get('confirm')
  async confirm(
    @Query('transactionId') transactionId: string,
    @Query('orderId') orderId: number,
  ) {
    return await this.linePayService.confirm(transactionId, orderId);
  }

  @Get('refund')
  async refund(
    @Query('transactionId') transactionId: string,
    //@Query('orderId') orderId: number,
  ) {
    return await this.linePayService.refund(transactionId);
  }
}
