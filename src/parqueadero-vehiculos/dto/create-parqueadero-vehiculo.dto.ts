import { IsInt, IsPositive, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateParqueaderoVehiculoDto {

    @IsInt()
    @IsPositive()
    idParqueadero: number;

    @IsString()
    @MinLength(6)
    @MaxLength(6)
    @Matches(/^[a-zA-Z0-9]{6}$/)
    placaVehiculo: string;
}
