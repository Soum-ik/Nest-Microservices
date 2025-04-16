import { Module } from '@nestjs/common';
import { ResveervationsService } from './resveervations.service';
import { ResveervationsController } from './resveervations.controller';
import { DatabaseModule } from '@app/common';
import { ResveervationsRepository } from './resveervations.repository';
import { ResveervationDocument, ResveervationSchema } from './models/resveervation.schema';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      {
        name: ResveervationDocument.name,
        schema: ResveervationSchema ,
      },
    ]),
  ],
  controllers: [ResveervationsController],
  providers: [ResveervationsService, ResveervationsRepository],
})
export class ResveervationsModule {}
