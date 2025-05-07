import { Inject, Injectable } from '@nestjs/common';
import { CreatereservationDto } from './dto/create-reservation.dto';
import { UpdatereservationDto } from './dto/update-reservation.dto';
import { reservationsRepository } from './reservations.repository';
import { PAYMENT_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class reservationsService {
  constructor(
    // Constructor logic can be added here if needed
    @Inject(PAYMENT_SERVICE) private readonly paymentService: ClientProxy,
    private readonly reservationRepository: reservationsRepository
  ) {}

  create(createreservationDto: CreatereservationDto, userId: string) {
    console.log('Payment successful', createreservationDto.charge);
    this.paymentService.send('charge', createreservationDto.charge).subscribe(async (res) => {
      console.log('Payment successful', res);
    });
    // return  this.reservationRepository.create({
    //   ...createreservationDto,
    //   timestamp: new Date(),
    //   userId,
    // });
  }

  findAll() {
    return this.reservationRepository.find({});
  }

  findOne(_id: string) {
    return this.reservationRepository.findOne({ _id });
  }

  update(_id: string, updatereservationDto: UpdatereservationDto) {
    return this.reservationRepository.findOneAndUpdate({ _id }, { $set: updatereservationDto });
  }

  remove(_id: string) {
    return this.reservationRepository.findOneAndDelete({ _id });
  }
}
