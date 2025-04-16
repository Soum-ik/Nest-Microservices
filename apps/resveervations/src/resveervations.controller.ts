import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResveervationsService } from './resveervations.service';
import { CreateResveervationDto } from './dto/create-resveervation.dto';
import { UpdateResveervationDto } from './dto/update-resveervation.dto';

@Controller('resveervations')
export class ResveervationsController {
  constructor(private readonly resveervationsService: ResveervationsService) {}

  @Post()
  create(@Body() createResveervationDto: CreateResveervationDto) {
    return this.resveervationsService.create(createResveervationDto);
  }

  @Get()
  findAll() {
    return this.resveervationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resveervationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResveervationDto: UpdateResveervationDto) {
    return this.resveervationsService.update(id, updateResveervationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resveervationsService.remove(id);
  }
}
