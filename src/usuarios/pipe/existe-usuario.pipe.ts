import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UsuariosService } from '../usuarios.service';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';

@Injectable()
export class ExisteUsuarioPipe implements PipeTransform {

  constructor(
    private readonly usuarioService: UsuariosService
  ) {}

  async transform(value: CreateUsuarioDto, metadata: ArgumentMetadata) {

    const usuario = await this.usuarioService.findOneByEmail(value.correo);

    if(usuario) {
      throw new BadRequestException("El usuario ya se encuentra registrado");
    }

    return value;
  }
}
