import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { ParqueaderosService } from '../parqueaderos.service';
import { CreateEmailDto } from 'src/email/dto/create-email.dto';

@Injectable()
export class NombreParqueaderoPipe implements PipeTransform {

  constructor(
    private readonly parqueaderoService: ParqueaderosService
  ) {}

  transform(value: any, metadata: ArgumentMetadata) {

    if(metadata.metatype.name == CreateEmailDto.name) {
      return this.parqueaderoService.consultarParqueaderoPorNombre(value.parqueaderoNombre)
      .then(
        (parqueadero) => {
          if(!parqueadero) {
            throw new NotFoundException("No existe parqueadero con ese nombre");
          }

          return value;
        }
      ).catch((error) => {
        throw error;
      });
    }

    return value;
  }
}
