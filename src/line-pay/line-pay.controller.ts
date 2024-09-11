import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { LinePayService } from './line-pay.service';

@Controller('line-pay')
export class LinePayController {
  constructor(private readonly linePayService: LinePayService) {}

  @Post('checkout')
  async checkout() {
    const response = await this.linePayService.checkout();
    return response;
  }

  @Get('/transaction/:id')
  async getTransaction(@Param('id', ParseIntPipe) id: number) {
    const response = await this.linePayService.getTransaction(id);
    return response;
  }
}
