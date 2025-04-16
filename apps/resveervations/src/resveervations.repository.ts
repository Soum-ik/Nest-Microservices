import { AbstractRepository } from '@app/common/database/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';
import { ResveervationDocument } from './models/resveervation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ResveervationsRepository extends AbstractRepository<ResveervationDocument> {
  protected readonly logger: Logger = new Logger(ResveervationsRepository.name);

  constructor(
    @InjectModel(ResveervationDocument.name)
    resveervationModel: Model<ResveervationDocument>,
  ) {
    super(resveervationModel);
  }
}
