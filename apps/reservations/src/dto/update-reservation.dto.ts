import { PartialType } from '@nestjs/mapped-types';
import { CreatereservationDto } from './create-reservation.dto';

export class UpdatereservationDto extends PartialType(CreatereservationDto) {}
