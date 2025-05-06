import { IsCreditCard, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class cardDto {
  @IsCreditCard()
  @IsNotEmpty()
  cardNumber: string;

  @IsString()
  @IsNotEmpty()
  cardHolderName: string;

  @IsNumber()
  @IsNotEmpty()
  exp_month: number;

  @IsNumber()
  @IsNotEmpty()
  exp_year: number;

  @IsString()
  @IsNotEmpty()
  cvv: string;
}
