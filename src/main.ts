import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
//import { MyLogger } from './logger/logger';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    //,{logger: new MyLogger(), //['log', 'error', 'warn', 'verbose'],}
  );
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(3000);
}

bootstrap();
