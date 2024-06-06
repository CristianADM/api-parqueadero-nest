import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsPositive, IsString, MaxLength, MinLength } from "class-validator";

export class CreateParqueaderoDto {

    @ApiProperty()
    @IsInt()
    @IsPositive()
    idUsuario: number;

    @ApiProperty()
    @IsString()
    @MinLength(4)
    @MaxLength(100)
    nombre: string;

    @ApiProperty()
    @IsInt()
    @IsPositive()
    valorHora: number;

    @ApiProperty()
    @IsInt()
    @IsPositive()
    capacidadVehiculos: number;
}
