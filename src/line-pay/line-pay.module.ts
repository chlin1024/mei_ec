import { Module } from '@nestjs/common';
import { LinePayService } from './line-pay.service';
import { HttpModule } from '@nestjs/axios';
import { LinePayController } from './line-pay.controller';

@Module({
  imports: [HttpModule],
  providers: [LinePayService],
  controllers: [LinePayController],
})
export class LinePayModule {}
