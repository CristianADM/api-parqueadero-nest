import { Module } from '@nestjs/common';
import { ParqueaderosModule } from './parqueaderos/parqueaderos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ParqueaderoVehiculosModule } from './parqueadero-vehiculos/parqueadero-vehiculos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { IndicadoresModule } from './indicadores/indicadores.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST_BD,
      port: +process.env.PUERTO_BD,
      username: process.env.USUARIO_BD,
      password: process.env.CONT_BD,
      database: process.env.NOMBRE_BD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ParqueaderosModule,
    ParqueaderoVehiculosModule,
    UsuariosModule,
    AuthModule,
    IndicadoresModule,
    EmailModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
