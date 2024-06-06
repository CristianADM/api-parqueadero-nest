import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [],
  providers: [UsuariosService],
  exports: [UsuariosService]
})
export class UsuariosModule {}
