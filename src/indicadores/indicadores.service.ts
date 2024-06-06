import { BadRequestException, Injectable } from '@nestjs/common';
import { ParqueaderoVehiculosService } from '../parqueadero-vehiculos/parqueadero-vehiculos.service';
import { IUsuarioActivo } from '../common/interfaces/user-active.interfaces';
import { RANGOTIEMPO } from '../common/constantes/constantes';

@Injectable()
export class IndicadoresService {

    constructor(
        private readonly parqueaderoVehiculosService: ParqueaderoVehiculosService
    ) {}

    async consultarVehiculosMasRegistradosGeneral(usuario: IUsuarioActivo) {
        const vehiculos = await this.parqueaderoVehiculosService.consultarVehiculosMasRegistradosGeneral(usuario);
        return {vehiculos}
    }
    
    async consultarVehiculosMasRegistradosPorParqueadero(idParqueadero: number, usuario: IUsuarioActivo) {
        const vehiculos = await this.parqueaderoVehiculosService.consultarVehiculosMasRegistradosPorParqueadero(idParqueadero, usuario);
        return {vehiculos}
    }
    
    async consultarVehiculosPrimeraVezPorParqueadero(idParqueadero: number, usuario: IUsuarioActivo) {
        const vehiculos = await this.parqueaderoVehiculosService.consultarVehiculosPrimeraVezPorParqueadero(idParqueadero, usuario);
        return {vehiculos}
    }
    
    async consultarGananciasPorParqueadero(idParqueadero: number, usuario: IUsuarioActivo, rangoTiempo: string) {
        const ganancias = await this.parqueaderoVehiculosService.consultarGanaciasPorParqueadero(idParqueadero, usuario, rangoTiempo);
        return {ganancias}
    }
}
