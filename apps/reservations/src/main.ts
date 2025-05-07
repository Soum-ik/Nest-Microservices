import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { reservationsModule } from './reservations.module';
import { Transport } from '@nestjs/microservices';
async function bootstrap() {
  const app = await NestFactory.create(reservationsModule);
  const configService = app.get(ConfigService);
  console.log('Hello from reservations service!');
  console.log(`PORT: ${configService.get('PORT')}`);
  console.log(`AUTH_HOST: ${configService.get('AUTH_HOST')}`);
  
  app.connectMicroservice({ transport: Transport.TCP });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));
  app.use(cookieParser());
  await app.listen(configService.get('PORT') ?? 3000);
}
bootstrap();