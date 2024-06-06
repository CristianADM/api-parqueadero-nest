import { ApiProperty } from "@nestjs/swagger";

export class CreateUsuarioDto {
    
    @ApiProperty()
    correo: string;

    @ApiProperty()
    nombre?: string;
    
    @ApiProperty()
    contrasenna: string;
}
