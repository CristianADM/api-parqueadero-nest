import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { ParqueaderosService } from '../parqueaderos.service';

@Injectable()
export class ExisteParqueaderosPipe implements PipeTransform {

  constructor(
    private readonly parqueaderoService: ParqueaderosService
  ) {}

  async transform(value: any, metadata: ArgumentMetadata) {

    let id;

    if(metadata.type === 'param') {
      id = value;
    }
    
    if(metadata.type === 'body') {
      id = value.idParqueadero;
    }

    return this.parqueaderoService.consultarParqueaderoPorId(id)
    .then(
      (parqueadero) => {
        if(!parqueadero) {
          throw new NotFoundException("No existe parqueadero con es Id");
        }

        return value;
      }
    ).catch((error) => {
      throw error;
    });
  }
}
