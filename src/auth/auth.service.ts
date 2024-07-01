import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsuariosService } from '../usuarios/usuarios.service';
import { UsuarioRegistroDto } from './dto/usuario-registro.dto';
import { LoginDto } from './dto/login.dto';
import { IUsuarioActivo } from '../common/interfaces/user-active.interfaces';

@Injectable()
export class AuthService {

    constructor(
        private readonly usuarioService: UsuariosService,
        private readonly jwtService: JwtService
    ) {}

    async registroUsuarios(usuarioRegistroDto: UsuarioRegistroDto) {
        const salt = bcrypt.genSaltSync();
        usuarioRegistroDto.contrasenna = bcrypt.hashSync(usuarioRegistroDto.contrasenna, salt);
        
        const {contrasenna, ...usuarioRegistro} = await this.usuarioService.create(usuarioRegistroDto);
        return usuarioRegistro;
    }

    async login(loginDto: LoginDto) {
        const usuario = await this.usuarioService.buscarPorCorreoConContrasenna(loginDto.correo);

        if(!usuario) {
            throw new BadRequestException("El correo y/o contraseña no son validos");
        }

        const esContrasennaValida = bcrypt.compareSync(loginDto.contrasenna, usuario.contrasenna);
        if(!esContrasennaValida) {
            throw new BadRequestException("El correo y/o contraseña no son validos");
        }

        const payload = {
            idUsuario: usuario.idUsuario,
            correo: usuario.correo,
            rol: usuario.rol
        };

        const token = await this.jwtService.signAsync(payload);

        await this.usuarioService.registrarToken(usuario.idUsuario, token);

        return {token};
    }
    
    logout(usuario: IUsuarioActivo) {
        return this.usuarioService.eliminarToken(usuario.idUsuario).then(() => {
            return {message: "Sesión finalizada"}
        }).catch((error) => {throw error;});
    }
}
