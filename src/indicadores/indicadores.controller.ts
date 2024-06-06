import { Controller, Get, Param, Query } from '@nestjs/common';
import { IndicadoresService } from './indicadores.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { Rol } from '../common/enums/rol.enum';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { IUsuarioActivo } from '../common/interfaces/user-active.interfaces';
import { ExisteParqueaderosPipe } from '../parqueaderos/pipes/existe-parqueaderos.pipe';
import { ValidacionRangoTiempoPipe } from '../common/pipes/validacion-rango-tiempo.pipe';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Indicadores')
@ApiBearerAuth()
@Controller('indicadores')
export class IndicadoresController {
  constructor(private readonly indicadoresService: IndicadoresService) {}

  @ApiOperation({ summary: 'Consultar los 10 vehiculos con mas registros - Administrador/Socio' })
  @Get('/vehivulos-mas-registrados')
  @Auth([Rol.ADMIN, Rol.SOCIO])
  consultarVehiculosMasRegistradosGeneral(@ActiveUser() usuario: IUsuarioActivo) {

    return this.indicadoresService.consultarVehiculosMasRegistradosGeneral(usuario);
  }
  
  @ApiOperation({ summary: 'Consultar los 10 vehiculos con mas registros por parqueadero - Administrador/Socio' })
  @Get('/vehiculos-mas-registrados-por-parqueadero/:idParqueadero')
  @Auth([Rol.ADMIN, Rol.SOCIO])
  consultarVehiculosMasRegistradosPorParqueadero(
      @Param('idParqueadero', ExisteParqueaderosPipe) idParqueadero: number,
      @ActiveUser() usuario: IUsuarioActivo) {

    return this.indicadoresService.consultarVehiculosMasRegistradosPorParqueadero(idParqueadero, usuario);
  }
  
  @ApiOperation({ summary: 'Consultar los vehiculos que han estado solo una vez en un parqueadero - Administrador/Socio' })
  @Get('/vehiculos-primera-vez/:idParqueadero')
  @Auth([Rol.ADMIN, Rol.SOCIO])
  consultarVehiculosPrimeraVezPorParqueadero(
      @Param('idParqueadero', ExisteParqueaderosPipe) idParqueadero: number,
      @ActiveUser() usuario: IUsuarioActivo) {
    return this.indicadoresService.consultarVehiculosPrimeraVezPorParqueadero(idParqueadero, usuario);
  }
  
  @ApiOperation({ summary: 'Ganancias por parqueadero - Socio' })
  @Get('/ganancias/:idParqueadero')
  @Auth([Rol.SOCIO])
  consultarGananciasPorParqueadero(
      @Param('idParqueadero', ExisteParqueaderosPipe) idParqueadero: number,
      @Query('rangoTiempo', ValidacionRangoTiempoPipe) rangoTiempo: string,
      @ActiveUser() usuario: IUsuarioActivo) {
    return this.indicadoresService.consultarGananciasPorParqueadero(idParqueadero, usuario, rangoTiempo);
  }
}
