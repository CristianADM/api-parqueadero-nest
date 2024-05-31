import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UsuarioRegistroDto {
    
    @IsEmail()
    @MaxLength(255)
    correo: string;

    
    @IsOptional()
    @Transform(({value}) => value.trim())
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    nombre: string;

    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(6)
    @MaxLength(255)
    contrasenna: string;
}