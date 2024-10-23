import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MyLogger } from './utils/logger/logger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './utils/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: new MyLogger() });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('mei-ecommerce')
    .setDescription('The mei-ecommerce API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}

bootstrap();
