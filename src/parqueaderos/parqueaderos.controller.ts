import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UsePipes } from '@nestjs/common';
import { ParqueaderosService } from './parqueaderos.service';
import { CreateParqueaderoDto } from './dto/create-parqueadero.dto';
import { UpdateParqueaderoDto } from './dto/update-parqueadero.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Rol } from '../common/enums/rol.enum';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { IUsuarioActivo } from '../common/interfaces/user-active.interfaces';
import { ExisteParqueaderosPipe } from './pipes/existe-parqueaderos.pipe';
import { ValidacionParqueaderoPipe } from './pipes/validacion-parqueadero.pipe';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Parqueaderos')
@ApiBearerAuth()
@Controller('parqueaderos')
export class ParqueaderosController {
  constructor(private readonly parqueaderosService: ParqueaderosService) {}

  @ApiOperation({ summary: 'Crear un parqueadero - Administrador' })
  @Post()
  @Auth([Rol.ADMIN])
  create(@Body(ValidacionParqueaderoPipe) createParqueaderoDto: CreateParqueaderoDto) {
    return this.parqueaderosService.create(createParqueaderoDto);
  }

  @ApiOperation({ summary: 'Listar todos los parqueaderos - Administrador' })
  @Get()
  @Auth([Rol.ADMIN])
  findAll() {
    return this.parqueaderosService.consultarParqueaderosAdministrador();
  }

  @ApiOperation({ summary: 'Listar todos los parqueaderos asociados - Socios' })
  @Get('/socio')
  @Auth([Rol.SOCIO])
  consultarParqueaderosSocio(@ActiveUser() usuario: IUsuarioActivo) {
    return this.parqueaderosService.consultarParqueaderosSocio(usuario);
  }

  @ApiOperation({ summary: 'Actualizar un parquedaero - Administrador' })
  @Patch(':id')
  @Auth([Rol.ADMIN])
  update(@Param('id', ParseIntPipe, ExisteParqueaderosPipe) id: number, 
    @Body(ValidacionParqueaderoPipe) updateParqueaderoDto: UpdateParqueaderoDto) {
    return this.parqueaderosService.update(id, updateParqueaderoDto);
  }

  @ApiOperation({ summary: 'Eliminar un parqueadero - Administrador' })
  @Delete(':id')
  @Auth([Rol.ADMIN])
  remove(@Param('id', ParseIntPipe, ExisteParqueaderosPipe) id: number) {
    return this.parqueaderosService.remove(id);
  }
}
