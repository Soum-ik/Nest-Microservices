import { NestFactory } from '@nestjs/core';
import { reservationsModule } from './reservations.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(reservationsModule);
  console.log('Hello from reservations service!');
  const configService = app.get(ConfigService);
  app.connectMicroservice({ transport: Transport.TCP });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));
  await app.listen(configService.get('PORT') ?? 3000);
}
bootstrap();
