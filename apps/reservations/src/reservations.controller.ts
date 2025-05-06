import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { reservationsService } from './reservations.service';
import { CreatereservationDto } from './dto/create-reservation.dto';
import { UpdatereservationDto } from './dto/update-reservation.dto';
import { CurrentUser, JwtAuthGuard, UserDto } from '@app/common';
import { UserDocument } from 'apps/auth/src/users/models/users.schema'; 

@Controller('reservations')
export class reservationsController {
  constructor(private readonly reservationsService: reservationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createreservationDto: CreatereservationDto, @CurrentUser() user: UserDto) {
    const _user = this.reservationsService.create(createreservationDto, user.id);
    console.log(_user, 'user from create reservation');
    return _user;
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
