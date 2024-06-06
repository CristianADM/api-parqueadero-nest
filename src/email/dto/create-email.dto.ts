import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateEmailDto {
        
    @Transform(({value}) => value.trim())
    @IsEmail()
    @MaxLength(60)
    email: string;

    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(6)
    @MaxLength(6)
    @Matches(/^[a-zA-Z0-9]{6}$/)
    placa: string;

    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(6)
    @MaxLength(300)
    mensaje: string

    @Transform(({value}) => value.trim())
    @IsString()
    @IsNotEmpty()
    parqueaderoNombre: string;
}
