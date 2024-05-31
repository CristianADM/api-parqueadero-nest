import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsuariosService } from 'src/usuarios/usuarios.service';
import { UsuarioRegistroDto } from './dto/usuario-registro.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly usuarioService: UsuariosService,
        private readonly jwtService: JwtService
    ) {}

    async registroUsuarios(usuarioRegistroDto: UsuarioRegistroDto) {
        const usuario = await this.usuarioService.findOneByEmail(usuarioRegistroDto.correo);

        if(usuario) {
            throw new BadRequestException("El usuario ya se encuentra registrado");
        }

        const salt = bcrypt.genSaltSync();
        usuarioRegistroDto.contrasenna = bcrypt.hashSync(usuarioRegistroDto.contrasenna, salt);
        
        const {contrasenna, ...usuarioRegistro} = await this.usuarioService.create(usuarioRegistroDto);
        return usuarioRegistro;
    }

    async login(loginDto: LoginDto) {
        const usuario = await this.usuarioService.findOneByEmail(loginDto.correo);

        if(!usuario) {
            throw new BadRequestException("El correo y/o contraseña no son validos");
        }

        const esContrasennaValida = bcrypt.compareSync(loginDto.contrasenna, usuario.contrasenna);
        if(!esContrasennaValida) {
            throw new BadRequestException("El correo y/o contraseña no son validos");
        }

        const payload = {
            correo: usuario.correo,
            usuario: usuario.rol
        };

        const token = await this.jwtService.signAsync(payload);

        return {token};
    }

    async profile({correo, rol}: {correo: string, rol: string}) {
        return await this.usuarioService.findOneByEmail(correo);
    }
}
