import { Module, forwardRef } from '@nestjs/common';
import { ParqueaderoVehiculosService } from './parqueadero-vehiculos.service';
import { ParqueaderoVehiculosController } from './parqueadero-vehiculos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParqueaderoVehiculo } from './entities/parqueadero-vehiculo.entity';
import { ParqueaderosModule } from '../parqueaderos/parqueaderos.module';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [TypeOrmModule.forFeature([ParqueaderoVehiculo]), 
  forwardRef(() => ParqueaderosModule),
  UsuariosModule],
  controllers: [ParqueaderoVehiculosController],
  providers: [ParqueaderoVehiculosService],
  exports: [ParqueaderoVehiculosService]
})
export class ParqueaderoVehiculosModule {}
