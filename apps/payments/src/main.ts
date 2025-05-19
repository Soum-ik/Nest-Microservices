import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import * as bodyParser from 'body-parser';


async function bootstrap() {
  // Create a hybrid application that can handle both HTTP and microservice requests
  const app = await NestFactory.create(PaymentsModule);
  const configService = app.get(ConfigService);

  // Setup microservice communication via TCP
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('PORT'),
    },
  });

  // Use raw body parser specifically for Stripe webhooks
  app.use('/webhook', bodyParser.raw({ type: 'application/json' }));

  // Configure HTTP server settings
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );
  app.useLogger(app.get(Logger));

  // Optional: Add CORS for the HTTP server if needed
  app.enableCors({
    origin: configService.get('FRONTEND_URL'), // Or true for any origin during development
    credentials: true,
  });

  // Start both the microservice and HTTP server
  await app.startAllMicroservices();
  await app.listen(configService.get('HTTP_PROT') || 3005); // Use a different port for HTTP

  console.log(`Payment service running on ports: TCP:${configService.get('PORT')}, HTTP:${configService.get('HTTP_PORT') || 3002}`);
}
bootstrap();
