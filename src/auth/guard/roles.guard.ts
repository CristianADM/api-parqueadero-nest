import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Rol } from '../../common/enums/rol.enum';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(
    private readonly relfector: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean {

    const roles: string[] = this.relfector.getAllAndOverride<Rol[]>(ROLES_KEY,
      [
        context.getHandler(),
        context.getClass()
      ]
    );

    if(!roles) {
      return true;
    }

    const {usuario} = context.switchToHttp().getRequest();

    return roles.includes(usuario.rol);
  }
}
