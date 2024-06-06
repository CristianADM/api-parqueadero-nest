import { Module, forwardRef } from '@nestjs/common';
import { ParqueaderosService } from './parqueaderos.service';
import { ParqueaderosController } from './parqueaderos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parqueadero } from './entities/parqueadero.entity';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { ParqueaderoVehiculosModule } from '../parqueadero-vehiculos/parqueadero-vehiculos.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
      TypeOrmModule.forFeature([Parqueadero]), 
      UsuariosModule, 
      forwardRef (()=> EmailModule),
      forwardRef (()=> ParqueaderoVehiculosModule)
    ],
  controllers: [ParqueaderosController],
  providers: [ParqueaderosService],
  exports: [ParqueaderosService]
})
export class ParqueaderosModule {}
