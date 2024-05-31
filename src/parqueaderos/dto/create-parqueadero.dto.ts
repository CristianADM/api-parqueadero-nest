import { IsInt, IsPositive, IsString, MaxLength, MinLength } from "class-validator";

export class CreateParqueaderoDto {

    @IsString()
    @MinLength(4)
    @MaxLength(100)
    nombre: string;

    @IsInt()
    @IsPositive()
    valorHora: number;

    @IsInt()
    @IsPositive()
    capacidadVehiculos: number;
}
