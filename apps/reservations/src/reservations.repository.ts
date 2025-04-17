import { AbstractRepository } from '@app/common/database/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';
import { reservationDocument } from './models/reservation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class reservationsRepository extends AbstractRepository<reservationDocument> {
  protected readonly logger: Logger = new Logger(reservationsRepository.name);

  constructor(
    @InjectModel(reservationDocument.name)
    reservationModel: Model<reservationDocument>,
  ) {
    super(reservationModel);
  }
}
