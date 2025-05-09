import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service'; 
import { LoggerModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/payments/.env', // Updated path to point to the reservation service .env file
      validationSchema: Joi.object({
        PORT : Joi.number().required(),
        STRIPE_SECRET_API_KEY: Joi.string().required(),
        STRIPE_PUBLIC_API_KEY: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        FRONTEND_URL: Joi.string().required(),
      }),
    }),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
