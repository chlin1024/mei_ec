import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MyLogger } from './utils/logger/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: new MyLogger() });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(3000);
}

bootstrap();
