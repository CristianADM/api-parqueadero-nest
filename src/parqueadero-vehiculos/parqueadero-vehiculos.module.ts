import { Module } from '@nestjs/common';
import { ParqueaderoVehiculosService } from './parqueadero-vehiculos.service';
import { ParqueaderoVehiculosController } from './parqueadero-vehiculos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParqueaderoVehiculo } from './entities/parqueadero-vehiculo.entity';
import { ParqueaderosModule } from 'src/parqueaderos/parqueaderos.module';
import { ParqueaderosService } from 'src/parqueaderos/parqueaderos.service';

@Module({
  imports: [TypeOrmModule.forFeature([ParqueaderoVehiculo]), ParqueaderosModule],
  controllers: [ParqueaderoVehiculosController],
  providers: [ParqueaderoVehiculosService, ParqueaderosService],
})
export class ParqueaderoVehiculosModule {}
