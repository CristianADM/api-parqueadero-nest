import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { NombreParqueaderoPipe } from 'src/parqueaderos/pipes/nombre-parqueadero.pipe';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Rol } from 'src/common/enums/rol.enum';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { IUsuarioActivo } from 'src/common/interfaces/user-active.interfaces';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  @Auth([Rol.ADMIN])
  create(@ActiveUser() usuario: IUsuarioActivo,
      @Body(NombreParqueaderoPipe) createEmailDto: CreateEmailDto) {
    return this.emailService.create(usuario, createEmailDto);
  }
}
