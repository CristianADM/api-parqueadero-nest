import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(
    private readonly relfecto: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean {

    const roles = this.relfecto.getAllAndOverride('roles',
      [
        context.getHandler(),
        context.getClass()
      ]
    );

    console.log(roles);

    return true;
  }
}
