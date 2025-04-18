import { NestFactory } from '@nestjs/core';
import { reservationsModule } from './reservations.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {   
  const app = await NestFactory.create(reservationsModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));
  app.useLogger(app.get(Logger));
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
