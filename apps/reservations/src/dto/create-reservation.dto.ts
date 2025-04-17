import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

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
}
