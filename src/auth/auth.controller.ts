import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsuarioRegistroDto } from './dto/usuario-registro.dto';
import { LoginDto } from './dto/login.dto';
import { Rol } from '../common/enums/rol.enum'; 
import { Auth } from './decorators/auth.decorator';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { IUsuarioActivo } from '../common/interfaces/user-active.interfaces';
import { ExisteUsuarioPipe } from '../usuarios/pipe/existe-usuario.pipe';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Autenticacion')
@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {}

    @ApiOperation({ summary: 'Registrar un socio - Administrador' })
    @ApiBearerAuth()
    @Post('/registro-socios')
    @Auth([Rol.ADMIN])
    registroUsuarios(@Body(ExisteUsuarioPipe) usuarioRegistroDto: UsuarioRegistroDto) {
        return this.authService.registroUsuarios(usuarioRegistroDto);
    }

    @ApiOperation({ summary: 'Realizar inicio de sesión - Administrador/Socio' })
    @Post('/login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @ApiOperation({ summary: 'Finalizar la sesión - Administrador/Socio' })
    @ApiBearerAuth()
    @Post('/logout')
    @Auth([Rol.ADMIN, Rol.SOCIO])
    logout(@ActiveUser() usuario: IUsuarioActivo) {
        return this.authService.logout(usuario);
    }
}