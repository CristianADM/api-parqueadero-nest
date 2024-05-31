import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsuarioRegistroDto } from './dto/usuario-registro.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';
import { Request } from 'express';
import { RolesGuard } from './guard/roles.guard';
import { Roles } from './decorators/roles.decorator';

interface RequestWithUser extends Request {
    usuario: {
        correo: string;
        rol: string;
    }
}

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('/registro-usuarios')
    registroUsuarios(@Body() usuarioRegistroDto: UsuarioRegistroDto) {
        return this.authService.registroUsuarios(usuarioRegistroDto);
    }

    @Post('/login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Get('usuarios')
    @Roles('ADMIN')
    @UseGuards(AuthGuard, RolesGuard)
    listaUsuarios(@Req() request: RequestWithUser) {
        return this.authService.profile(request.usuario);
    }
}