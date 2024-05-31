import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParqueaderosService } from './parqueaderos.service';
import { CreateParqueaderoDto } from './dto/create-parqueadero.dto';
import { UpdateParqueaderoDto } from './dto/update-parqueadero.dto';
import { Parqueadero } from './entities/parqueadero.entity';

@Controller('parqueaderos')
export class ParqueaderosController {
  constructor(private readonly parqueaderosService: ParqueaderosService) {}

  @Post()
  create(@Body() createParqueaderoDto: CreateParqueaderoDto) {
    return this.parqueaderosService.create(createParqueaderoDto);
  }

  @Get()
  findAll() {
    return this.parqueaderosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.parqueaderosService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateParqueaderoDto: UpdateParqueaderoDto) {

    return this.parqueaderosService.update(id, updateParqueaderoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.parqueaderosService.remove(id);
  }
}
