import { ArgumentMetadata, BadRequestException, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { ParqueaderosService } from '../../parqueaderos/parqueaderos.service';
import { CreateParqueaderoVehiculoDto } from '../dto/create-parqueadero-vehiculo.dto';
import { ParqueaderoVehiculosService } from '../parqueadero-vehiculos.service';
import { UpdateParqueaderoVehiculoDto } from '../dto/update-parqueadero-vehiculo.dto';

@Injectable()
export class ValidacionIngresoVehiculosPipe implements PipeTransform {

  constructor(
    private readonly parqueaderoService: ParqueaderosService,
    private readonly parqvehiculoService: ParqueaderoVehiculosService
  ) {

  }

  async transform(value: any, metadata: ArgumentMetadata) {

    //Consultamos el vehiculo porque se busca para entrada y salida
    const vehiculo = await this.parqvehiculoService.consultarVehiculoPorPlacaPipe(value.placaVehiculo);

    //validacion ingreso a vehiculo a parqueadero
    if(metadata.metatype.name == CreateParqueaderoVehiculoDto.name) {
      const parqueadero = await this.parqueaderoService.consultarParqueaderoPorId(value.idParqueadero);

      if(parqueadero.espaciosDisponibles === 0) {
        throw new BadRequestException('No hay espacios en el parqueadero');
      }
      
      //Si el vehiculo ya esta en un parqueadero lo indicamos
      if(vehiculo) {
        throw new BadRequestException('Vehículo ya se encuentra registrado');
      }

      //validacion salida vehiculo parqueadero
    } else if(metadata.metatype.name == UpdateParqueaderoVehiculoDto.name) {
      
      //Si no se encuentra regustri del vehiculo
      if(!vehiculo) {
        throw new NotFoundException("No existe vehiculo registrado con esa placa");

        //Si el vehiculo se encuentra registrado en otro parqueadero
      } else if(vehiculo && vehiculo.parqueadero.idParqueadero == value.idParqueadero) {
        throw new BadRequestException('El vehículo no está registrado en este parqueadero');
      } 

    }
    

    return value;
  }
}
