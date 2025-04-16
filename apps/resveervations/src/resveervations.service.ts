import { Injectable } from '@nestjs/common';
import { CreateResveervationDto } from './dto/create-resveervation.dto';
import { UpdateResveervationDto } from './dto/update-resveervation.dto';
import { ResveervationsRepository } from './resveervations.repository';

@Injectable()
export class ResveervationsService {
  constructor(
    // Constructor logic can be added here if needed
    private readonly resveervationRepository: ResveervationsRepository,
  ) {}

  create(createResveervationDto: CreateResveervationDto) {
    return this.resveervationRepository.create({
      ...createResveervationDto,
      timestamp: new Date(),
      userId: '123',
    });
  }

  findAll() {
    return this.resveervationRepository.find({});
  }

  findOne(_id: string) {
    return this.resveervationRepository.findOne({ _id });
  }

  update(_id: string, updateResveervationDto: UpdateResveervationDto) {
    return this.resveervationRepository.findOneAndUpdate(
      { _id },
      { $set: updateResveervationDto },
    );
  }

  remove(_id: string) {
    return this.resveervationRepository.findOneAndDelete({ _id });
  }
}
