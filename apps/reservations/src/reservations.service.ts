import { Inject, Injectable } from '@nestjs/common';
import { CreatereservationDto } from './dto/create-reservation.dto';
import { UpdatereservationDto } from './dto/update-reservation.dto';
import { reservationsRepository } from './reservations.repository';
import { PAYMENT_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class reservationsService {
  constructor(
    @Inject(PAYMENT_SERVICE) private readonly paymentService: ClientProxy,
    private readonly reservationRepository: reservationsRepository
  ) {}

  async initiateReservation(createreservationDto: CreatereservationDto, userId: string) {
    // Create a pending reservation record
    const pendingReservation = await this.reservationRepository.create({
      ...createreservationDto,
      timestamp: new Date(),
      userId,
      status: 'pending', // Add a status field to your schema
    });

    // Create a checkout session with metadata
    const checkoutResult = await firstValueFrom(
      this.paymentService.send('create-checkout-session', {
        amount: createreservationDto.charge.amount,
        email: createreservationDto.charge.email,
        metadata: {
          reservationId: pendingReservation._id.toString(),
          userId,
        },
      })
    );

    return {
      reservationId: pendingReservation._id,
      checkoutUrl: checkoutResult.url,
      sessionId: checkoutResult.sessionId,
    };
  }

  async confirmReservation(sessionId: string) {
    // Verify the payment was successful
    const paymentResult = await firstValueFrom(this.paymentService.send('verify-payment', { sessionId }));

    if (paymentResult.isPaid && paymentResult.metadata?.reservationId) {
      // Update the reservation to confirmed
      await this.reservationRepository.findOneAndUpdate({ _id: paymentResult.metadata.reservationId }, { $set: { status: 'confirmed' } });

      return { success: true, reservationId: paymentResult.metadata.reservationId };
    }

    return { success: false, message: 'Payment verification failed' };
  }

  // Add this method to handle webhook confirmations
  async updateReservationStatus(reservationId: string, status: string) {
    try {
      const reservation = await this.reservationRepository.findOneAndUpdate(
        { _id: reservationId },
        { $set: { status } }
      );
      
      return { success: true, reservation };
    } catch (error) {
      return { success: false, error: error.message };
    }
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
