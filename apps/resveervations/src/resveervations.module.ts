import { Module } from '@nestjs/common';
import { ResveervationsService } from './resveervations.service';
import { ResveervationsController } from './resveervations.controller';
import { DatabaseModule } from '@app/common';
import { ResveervationsRepository } from './resveervations.repository';
import {
  ResveervationDocument,
  ResveervationSchema,
} from './models/resveervation.schema';
import { LoggerModule } from 'nestjs-pino';
@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      {
        name: ResveervationDocument.name,
        schema: ResveervationSchema,
      },
    ]),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            colorize: true,
            translateTime: 'SYS:standard',
          },
        },
      },
    }),
  ],
  controllers: [ResveervationsController],
  providers: [ResveervationsService, ResveervationsRepository],
})
export class ResveervationsModule {}
