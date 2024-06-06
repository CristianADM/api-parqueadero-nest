import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {

    @ApiProperty()
    @IsEmail()
    @MaxLength(255)
    correo: string;

    @ApiProperty()
    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(6)
    @MaxLength(255)
    contrasenna: string;
}