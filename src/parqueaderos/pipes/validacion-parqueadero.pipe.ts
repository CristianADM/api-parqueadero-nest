import { ArgumentMetadata, BadRequestException, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { UpdateParqueaderoDto } from '../dto/update-parqueadero.dto';
import { ParqueaderosService } from '../parqueaderos.service';
import { UsuariosService } from '../../usuarios/usuarios.service';
import { ESTADOS } from '../../common/constantes/constantes';

@Injectable()
export class ValidacionParqueaderoPipe implements PipeTransform {

  constructor(
    private readonly parqueaderoService: ParqueaderosService,
    private readonly usuarioService: UsuariosService
  ) {}

  async transform(value: UpdateParqueaderoDto, metadata: ArgumentMetadata) {

    if(value.idUsuario) {
      const usuario = await this.usuarioService.consultarUsuarioPorIdYEstado(value.idUsuario, ESTADOS.ACTIVO);
      
      if(!usuario) {
        throw new NotFoundException('No existe usuario con ese Id')
      }
    }

    if(value.nombre) {
      const parqueadero = await this.parqueaderoService.consultarParqueaderoPorNombre(value.nombre);
      if(parqueadero) {
        throw new BadRequestException('Ya existe un parqueadero registrado con ese nombre');
      }
    }
    return value;
  }
}
