import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiErrorResponses } from './utils/decorator/api-response.decorator.';

@ApiErrorResponses()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }
}
