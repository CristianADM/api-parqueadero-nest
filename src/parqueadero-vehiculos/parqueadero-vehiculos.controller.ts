import { Controller, Post, Body, Patch, Get, Param, Query } from '@nestjs/common';
import { ParqueaderoVehiculosService } from './parqueadero-vehiculos.service';
import { CreateParqueaderoVehiculoDto } from './dto/create-parqueadero-vehiculo.dto';
import { UpdateParqueaderoVehiculoDto } from './dto/update-parqueadero-vehiculo.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Rol } from '../common/enums/rol.enum';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { IUsuarioActivo } from '../common/interfaces/user-active.interfaces';
import { ValidacionIngresoVehiculosPipe } from './pipes/validacion-ingreso-vehiculos.pipe';
import { ExisteParqueaderosPipe } from '../parqueaderos/pipes/existe-parqueaderos.pipe';
import { ValidacionEstadosPipe } from '../common/pipes/validacion-estados.pipe';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Parqueaderos-Vehiculos')
@ApiBearerAuth()
@Controller('parqueadero-vehiculos')
export class ParqueaderoVehiculosController {
  constructor(private readonly parqueaderoVehiculosService: ParqueaderoVehiculosService) {}

  @ApiOperation({ summary: 'Realizar el ingreso de un vehiculo - Socio' })
  @Post()
  @Auth([Rol.SOCIO])
  registroIngreso(@ActiveUser() usuario: IUsuarioActivo, 
      @Body(ExisteParqueaderosPipe, ValidacionIngresoVehiculosPipe) createParqueaderoVehiculoDto: CreateParqueaderoVehiculoDto) {
    
        return this.parqueaderoVehiculosService.registroIngreso(usuario, createParqueaderoVehiculoDto);
  }
  
  @ApiOperation({ summary: 'Realizar la salida de un vehiculo - Socio' })
  @Patch("/salida-vehiculo")
  @Auth([Rol.SOCIO])
  salidaVehiculo(@ActiveUser() usuario: IUsuarioActivo, 
      @Body(ExisteParqueaderosPipe, ValidacionIngresoVehiculosPipe) updateParqueaderoVehiculoDto: UpdateParqueaderoVehiculoDto) {
    
        return this.parqueaderoVehiculosService.salidaVehiculo(usuario, updateParqueaderoVehiculoDto);
  }
  
  @ApiOperation({ summary: 'Consultar vehiculos por placa - Administrador/Socio' })
  @Get("/vehiculo-por-placa/:placa")
  @Auth([Rol.ADMIN, Rol.SOCIO])
  consultarVehiculoPorPlaca (@ActiveUser() usuario: IUsuarioActivo, 
    @Param('placa') placa: string) {

    return this.parqueaderoVehiculosService.consultarVehiculoPorPlaca(placa, usuario);
  }
  
  @ApiOperation({ summary: 'Listar los vehiculos en un parqueadero - Administrador/Socio' })
  @Get("/listado-vehiculos-por-parqueaderos/:idParqueadero")
  @Auth([Rol.ADMIN, Rol.SOCIO])
  consultarVehiculosPorParqueadero (@ActiveUser() usuario: IUsuarioActivo,
    @Param('idParqueadero', ExisteParqueaderosPipe) idParqueadero: number,
    @Query('estadoActivo', ValidacionEstadosPipe) estadoActivo: string) {
    
      return this.parqueaderoVehiculosService.consultarVehiculoPorParqueaderos(idParqueadero, estadoActivo, usuario);
  }
}
