import { Module } from '@nestjs/common';
import { reservationsService } from './reservations.service';
import { reservationsController } from './reservations.controller';
import { DatabaseModule, LoggerModule } from '@app/common';
import { reservationsRepository } from './reservations.repository';
import {
  reservationDocument,
  reservationSchema,
} from './models/reservation.schema';
@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      {
        name: reservationDocument.name,
        schema: reservationSchema,
      },
    ]),
    LoggerModule
  ],
  controllers: [reservationsController],
  providers: [reservationsService, reservationsRepository],
})
export class reservationsModule {}
