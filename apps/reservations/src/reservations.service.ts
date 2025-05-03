import { Injectable } from '@nestjs/common';
import { CreatereservationDto } from './dto/create-reservation.dto';
import { UpdatereservationDto } from './dto/update-reservation.dto';
import { reservationsRepository } from './reservations.repository';

@Injectable()
export class reservationsService {
  constructor(
    // Constructor logic can be added here if needed
    private readonly reservationRepository: reservationsRepository,
  ) {}

  create(createreservationDto: CreatereservationDto, userId: string) {
    return this.reservationRepository.create({
      ...createreservationDto,
      timestamp: new Date(),
      userId: userId,
    });
  }

  findAll() {
    return this.reservationRepository.find({});
  }

  findOne(_id: string) {
    return this.reservationRepository.findOne({ _id });
  }

  update(_id: string, updatereservationDto: UpdatereservationDto) {
    return this.reservationRepository.findOneAndUpdate(
      { _id },
      { $set: updatereservationDto },
    );
  }

  remove(_id: string) {
    return this.reservationRepository.findOneAndDelete({ _id });
  }
}
