import { NestFactory } from '@nestjs/core';
import { ResveervationsModule } from './resveervations.module';

async function bootstrap() {
  const app = await NestFactory.create(ResveervationsModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
