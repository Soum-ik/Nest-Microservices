import { NestFactory } from '@nestjs/core';
import { ResveervationsModule } from './resveervations.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(ResveervationsModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
