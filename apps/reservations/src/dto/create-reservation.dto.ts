import { CreateChargeDto } from '@app/common';
import { Type } from 'class-transformer';
import { IsDate, IsDefined, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreatereservationDto {
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  placeId: string;

  @IsString()
  @IsNotEmpty()
  invoiceId: string;

  @IsDefined()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateChargeDto)
  charge: CreateChargeDto;
}
