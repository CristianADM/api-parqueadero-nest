import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ESTADOS, ESTADOSSTRING } from '../constantes/constantes';

@Injectable()
export class ValidacionEstadosPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {

    const estados = [ESTADOSSTRING.ACTIVO, ESTADOSSTRING.INACTIVO];

    if(value) {
      if(!estados.includes(value)) {
        throw new BadRequestException(`El estadoActivo debe estar entre [${ESTADOSSTRING.ACTIVO}, ${ESTADOSSTRING.INACTIVO}] u omitirlo`);
      }
    }
    
    return value;
  }
}
