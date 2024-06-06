import { Module, forwardRef } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ParqueaderosModule } from 'src/parqueaderos/parqueaderos.module';
import { HttpModule } from '@nestjs/axios';
import { ParqueaderoVehiculosModule } from 'src/parqueadero-vehiculos/parqueadero-vehiculos.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  imports: [
    HttpModule,
    forwardRef (()=> ParqueaderosModule),
    ParqueaderoVehiculosModule,
    UsuariosModule
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
