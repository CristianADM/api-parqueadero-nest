import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParqueaderoVehiculosService } from './parqueadero-vehiculos.service';
import { CreateParqueaderoVehiculoDto } from './dto/create-parqueadero-vehiculo.dto';
import { UpdateParqueaderoVehiculoDto } from './dto/update-parqueadero-vehiculo.dto';

@Controller('parqueadero-vehiculos')
export class ParqueaderoVehiculosController {
  constructor(private readonly parqueaderoVehiculosService: ParqueaderoVehiculosService) {}

  @Post()
  registroIngreso(@Body() createParqueaderoVehiculoDto: CreateParqueaderoVehiculoDto) {
    return this.parqueaderoVehiculosService.registroIngreso(createParqueaderoVehiculoDto);
  }

  @Get()
  findAll() {
    return this.parqueaderoVehiculosService.findAll();
  }

  /*@Get(':id')
  findOne(@Param('id') id: string) {
    return this.parqueaderoVehiculosService.findOne(+id);
  }*/

  /*@Patch(':id')
  update(@Param('id') id: string, @Body() updateParqueaderoVehiculoDto: UpdateParqueaderoVehiculoDto) {
    return this.parqueaderoVehiculosService.update(+id, updateParqueaderoVehiculoDto);
  }*/
  
  @Patch("/salida-vehiculo")
  salidaVehiculo(@Body() updateParqueaderoVehiculoDto: UpdateParqueaderoVehiculoDto) {
    return this.parqueaderoVehiculosService.salidaVehiculo(updateParqueaderoVehiculoDto);
  }

  /*@Delete(':id')
  remove(@Param('id') id: string) {
    return this.parqueaderoVehiculosService.remove(+id);
  }*/
}
