import { Module } from '@nestjs/common';
import { IndicadoresService } from './indicadores.service';
import { IndicadoresController } from './indicadores.controller';
import { ParqueaderoVehiculosModule } from '../parqueadero-vehiculos/parqueadero-vehiculos.module';
import { ParqueaderosModule } from '../parqueaderos/parqueaderos.module';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [
    ParqueaderoVehiculosModule,
    ParqueaderosModule,
    UsuariosModule
  ],
  controllers: [IndicadoresController],
  providers: [IndicadoresService],
})
export class IndicadoresModule {}
