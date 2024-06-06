import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { RANGOTIEMPO } from '../constantes/constantes';

@Injectable()
export class ValidacionRangoTiempoPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {

    const rango = [RANGOTIEMPO.hoy, RANGOTIEMPO.semana, RANGOTIEMPO.mes, RANGOTIEMPO.año];

    console.log(value);

    if(!rango.includes(value)) {
      throw new BadRequestException(`El rango de tiempo debe estar entre [${RANGOTIEMPO.hoy}, ${RANGOTIEMPO.semana}, ${RANGOTIEMPO.mes}, ${RANGOTIEMPO.año}]`);
    }

    return value;
  }
}
