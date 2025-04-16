import { PartialType } from '@nestjs/mapped-types';
import { CreateResveervationDto } from './create-resveervation.dto';

export class UpdateResveervationDto extends PartialType(CreateResveervationDto) {}
