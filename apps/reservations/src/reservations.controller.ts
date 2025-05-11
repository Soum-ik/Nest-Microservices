import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CreatereservationDto } from './dto/create-reservation.dto';
import { UpdatereservationDto } from './dto/update-reservation.dto';
import { CurrentUser, JwtAuthGuard, UserDto } from '@app/common';
import { reservationsService } from './reservations.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('reservations')
export class reservationsController {
  constructor(private readonly reservationsService: reservationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createreservationDto: CreatereservationDto, @CurrentUser() user: UserDto) {
    return this.reservationsService.initiateReservation(createreservationDto, user.id);
  }

  // Add message pattern handler for webhook events
  @EventPattern('confirm-reservation-payment')
  async handlePaymentConfirmation(@Payload() data: { reservationId: string; status: string }) {
    return this.reservationsService.updateReservationStatus(data.reservationId, data.status);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatereservationDto: UpdatereservationDto) {
    return this.reservationsService.update(id, updatereservationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }
}
