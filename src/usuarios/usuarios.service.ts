import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsuariosService {

  constructor(
    @InjectRepository(Usuario) private readonly usuarioRepository: Repository<Usuario>
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
      const usuario = this.usuarioRepository.create(createUsuarioDto);
      return await this.usuarioRepository.save(usuario);
  }

  async findOneByEmail(correo: string) {
    return await this.usuarioRepository.findOneBy({
      correo,
      estadoActivo: true  
    });
  }

  async consultarUsuarioPorIdYEstado(idUsuario: number, estado: boolean) {
    return await this.usuarioRepository.findOneBy({
      idUsuario,
      estadoActivo: estado
    });
  }
  
  async buscarPorCorreoConContrasenna(correo: string) {
    return await this.usuarioRepository.findOne({
      where: {
        correo,
        estadoActivo: true
      },
      select: ['idUsuario', 'correo', 'contrasenna', 'rol']
    });
  }
  
  async consultarUsuarioPorToken(token: string) {
    return await this.usuarioRepository.findOne({
      where: {
        token,
        estadoActivo: true
      }
    });
  }
  
  async registrarToken(idUsuario, token: string) {
    return await this.usuarioRepository.update(idUsuario, {
      token: token
    });
  }
  
  async eliminarToken(idUsuario) {
    return await this.usuarioRepository.update(idUsuario, {
      token: null
    });
  }
}
