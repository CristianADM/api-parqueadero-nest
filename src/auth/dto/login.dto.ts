import { Transform } from "class-transformer";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {

    @IsEmail()
    @MaxLength(255)
    correo: string;

    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(6)
    @MaxLength(255)
    contrasenna: string;
}