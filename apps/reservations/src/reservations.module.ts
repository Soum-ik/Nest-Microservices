import { Module } from '@nestjs/common';
import { reservationsService } from './reservations.service';
import { reservationsController } from './reservations.controller';
import { AUTH_SERVICE, DatabaseModule, LoggerModule } from '@app/common';
import { reservationsRepository } from './reservations.repository';
import { reservationDocument, reservationSchema } from './models/reservation.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
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
      envFilePath: './apps/reservations/.env', // Updated path to point to the reservation service .env file
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_HOST'),
            port: configService.get('AUTH_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [reservationsController],
  providers: [reservationsService, reservationsRepository],
})
export class reservationsModule {}
