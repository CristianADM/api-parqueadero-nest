import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ParqueaderosService } from 'src/parqueaderos/parqueaderos.service';
import { ParqueaderoVehiculosService } from 'src/parqueadero-vehiculos/parqueadero-vehiculos.service';
import { IUsuarioActivo } from 'src/common/interfaces/user-active.interfaces';

@Injectable()
export class EmailService {

  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly parqueaderoService: ParqueaderosService,
    private readonly pvService: ParqueaderoVehiculosService
  ) {}

  async create(usuario: IUsuarioActivo, createEmailDto: CreateEmailDto) {
    const {parqueaderoNombre, ...datosEmail} = createEmailDto;

    const vehiculo = await this.pvService.consultarVehiculoPorPlacaPipe(createEmailDto.placa);
    
    if(!vehiculo) {
      throw new NotFoundException("No existe un vehiculo con esa placa registrada");
    }

    const parqueadero = await this.parqueaderoService.consultarParqueaderoPorNombre(createEmailDto.parqueaderoNombre);
    const payload = {
      parqueaderoId: parqueadero.idParqueadero,
      ...datosEmail
    };

    const res = await firstValueFrom(
      this.httpService.post(process.env.URLAPI, payload).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response);
          throw error;
        }),
      ),
    );

    console.log(res.data);

    return res.data;
  }
}
