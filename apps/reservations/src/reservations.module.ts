import { Module } from '@nestjs/common';
import { reservationsService } from './reservations.service';
import { reservationsController } from './reservations.controller';
import { DatabaseModule, LoggerModule } from '@app/common';
import { reservationsRepository } from './reservations.repository';
import {
  reservationDocument,
  reservationSchema,
} from './models/reservation.schema';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      {
        name: reservationDocument.name,
        schema: reservationSchema,
      },
    ]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
      }),
    }),
  ],
  controllers: [reservationsController],
  providers: [reservationsService, reservationsRepository],
})
export class reservationsModule {}
