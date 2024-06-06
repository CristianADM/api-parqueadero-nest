import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UsuarioRegistroDto {
    
    @ApiProperty()
    @IsEmail()
    @MaxLength(255)
    correo: string;

    @ApiProperty()
    @IsOptional()
    @Transform(({value}) => value.trim())
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    nombre: string;

    @ApiProperty()  
    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(6)
    @MaxLength(255)
    contrasenna: string;
}