import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { reservationsService } from './reservations.service';
import { CreatereservationDto } from './dto/create-reservation.dto';
import { UpdatereservationDto } from './dto/update-reservation.dto';

@Controller('reservations')
export class reservationsController {
  constructor(private readonly reservationsService: reservationsService) {}

  @Post()
  create(@Body() createreservationDto: CreatereservationDto) {
    return this.reservationsService.create(createreservationDto);
  }

  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatereservationDto: UpdatereservationDto) {
    return this.reservationsService.update(id, updatereservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }
}
