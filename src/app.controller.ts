import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiErrorResponses } from './utils/decorator/api-response.decorator.';
//import { ApiOkResponse } from '@nestjs/swagger';

@ApiErrorResponses()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  //@ApiOkResponse({ description: 'success.', example: 'hello world' })
  getHello(): string {
    return this.appService.getHello();
  }
}
