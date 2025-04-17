import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule} from 'nestjs-pino';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
            levelFirst: true,
          },
        },
      },
    }),
  ],
})
export class LoggerModule {}
