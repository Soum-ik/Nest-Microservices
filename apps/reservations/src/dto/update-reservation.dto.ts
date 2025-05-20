import { PartialType } from '@nestjs/mapped-types';
import { CreatereservationDto } from './create-reservation.dto';
import { IsString } from 'class-validator';

export class UpdatereservationDto {
  @IsString()
  sessionId: string;

  @IsString()
  reservationId: string;
  
  @IsString()
  userId: string;
  
  @IsString()
  status: string;
}
