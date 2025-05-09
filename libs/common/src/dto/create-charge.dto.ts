import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateChargeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
