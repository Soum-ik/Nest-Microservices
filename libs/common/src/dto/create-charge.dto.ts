import { cardDto } from './card.dto';
import { IsDefined, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateChargeDto {
  @IsDefined()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => cardDto)
  card: cardDto;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
