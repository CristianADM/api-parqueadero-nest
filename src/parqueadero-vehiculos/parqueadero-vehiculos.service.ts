import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException, forwardRef } from '@nestjs/common';
import { CreateParqueaderoVehiculoDto } from './dto/create-parqueadero-vehiculo.dto';
import { UpdateParqueaderoVehiculoDto } from './dto/update-parqueadero-vehiculo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ParqueaderoVehiculo } from './entities/parqueadero-vehiculo.entity';
import { Between, Like, Repository } from 'typeorm';
import { ESTADOS, ESTADOSSTRING, RANGOTIEMPO } from '../common/constantes/constantes';
import { ParqueaderosService } from '../parqueaderos/parqueaderos.service';
import { IUsuarioActivo } from '../common/interfaces/user-active.interfaces';
import { Rol } from '../common/enums/rol.enum';

@Injectable()
export class ParqueaderoVehiculosService {

  constructor(
    @InjectRepository(ParqueaderoVehiculo) private readonly parqueaderoVehiculoRepository: Repository<ParqueaderoVehiculo>,
    @Inject(forwardRef(() => ParqueaderosService))
    private parqueaderoService: ParqueaderosService,
  ) { }

  async registroIngreso(usuario: IUsuarioActivo, createParqueaderoVehiculoDto: CreateParqueaderoVehiculoDto) {

    const existeParqueadero = await this.parqueaderoService.consultarParqueaderoPorId(createParqueaderoVehiculoDto.idParqueadero);

    if(existeParqueadero.idUsuario !== usuario.idUsuario) {
      throw new UnauthorizedException('No tiene acceso a este parqueadero');
    }

    const parqueaderoVehiculo = this.parqueaderoVehiculoRepository.create({
      parqueadero: existeParqueadero,
      ...createParqueaderoVehiculoDto
    });
    
    parqueaderoVehiculo.fechaIngreso = new Date();
    const {parqueadero, ...vehiculo} = await this.parqueaderoVehiculoRepository.save(parqueaderoVehiculo);

    this.parqueaderoService.restarEspcioDisponible(existeParqueadero.idParqueadero);

    return vehiculo;
  }

  async cantidadVehiculosActivosPorIdParqueadero(idParqueadero: number) {
    return await this.parqueaderoVehiculoRepository.countBy({
      parqueadero: {
        idParqueadero
      },
      estadoActivo: ESTADOS.ACTIVO
    });
  }
  
  async salidaVehiculo(usuario: IUsuarioActivo, updateParqueaderoVehiculoDto: UpdateParqueaderoVehiculoDto) {

    const parqueadero = await this.parqueaderoService.consultarParqueaderoPorId(updateParqueaderoVehiculoDto.idParqueadero);

    if(!parqueadero) {
      throw new NotFoundException("No existe parqueadero con ese idParqueadero");
    }

    if(parqueadero.idUsuario !== usuario.idUsuario) {
      throw new UnauthorizedException('No tiene acceso a este parqueadero');
    }
    
    const vehiculo = await this.parqueaderoVehiculoRepository.findOne({
      where:{
        placaVehiculo: updateParqueaderoVehiculoDto.placaVehiculo,
        estadoActivo: true,
        parqueadero: {
          idParqueadero: updateParqueaderoVehiculoDto.idParqueadero
        }
      },
    });

    if(!vehiculo) {
      throw new NotFoundException("El vehículo no está registrado en este parqueadero");
    }

    vehiculo.estadoActivo = false;
    vehiculo.fechaSalida = new Date();
    const horasParqueado = (vehiculo.fechaSalida.getTime() - vehiculo.fechaIngreso.getTime()) / (1000 * 3600);

    vehiculo.valorTiempo = horasParqueado * parqueadero.valorHora;

    this.parqueaderoService.sumarEspcioDisponible(parqueadero.idParqueadero);

    return await this.parqueaderoVehiculoRepository.save(vehiculo);
  }

  async consultarVehiculosMasRegistradosGeneral(usuario: IUsuarioActivo) {

    if(usuario.rol == Rol.ADMIN) {
      return this.parqueaderoVehiculoRepository
        .createQueryBuilder('vp')
        .select('vp.placaVehiculo', 'PlacaVehiculo')
        .addSelect('COUNT(*)', 'cantidadIngresos')
        .groupBy('vp.placaVehiculo')
        .orderBy('cantidadIngresos', 'DESC')
        .limit(10) // Puedes ajustar el límite según tus necesidades
        .getRawMany();
    } else {
      return this.parqueaderoVehiculoRepository
        .createQueryBuilder('vp')
        .select('vp.placaVehiculo', 'PlacaVehiculo')
        .innerJoin("vp.parqueadero", "p")
        .where('p.idUsuario = :idUsuario', {idUsuario: usuario.idUsuario})
        .addSelect('COUNT(*)', 'cantidadIngresos')
        .groupBy('vp.placaVehiculo')
        .orderBy('cantidadIngresos', 'DESC')
        .limit(10) // Puedes ajustar el límite según tus necesidades
        .getRawMany();
    }
  }
  
  async consultarVehiculosMasRegistradosPorParqueadero(idParqueadero: number, usuario: IUsuarioActivo) {

    const parqueadero = await this.parqueaderoService.consultarParqueaderoPorId(idParqueadero);

    if(usuario.rol === Rol.SOCIO && parqueadero.idUsuario !== usuario.idUsuario) {
      throw new BadRequestException('No tiene acceso a este parqueadero');
    }

    return this.parqueaderoVehiculoRepository
        .createQueryBuilder('vp')
        .select('vp.placaVehiculo', 'PlacaVehiculo')
        .innerJoin("vp.parqueadero", "p")
        .where('p.idParqueadero = :idParqueadero', {idParqueadero})
        .addSelect('COUNT(*)', 'cantidadIngresos')
        .groupBy('vp.placaVehiculo')
        .orderBy('cantidadIngresos', 'DESC')
        .limit(10) // Puedes ajustar el límite según tus necesidades
        .getRawMany();
  }
  
  async consultarVehiculosPrimeraVezPorParqueadero(idParqueadero: number, usuario: IUsuarioActivo) {

    const parqueadero = await this.parqueaderoService.consultarParqueaderoPorId(idParqueadero);

    if(usuario.rol === Rol.SOCIO && parqueadero.idUsuario !== usuario.idUsuario) {
      throw new BadRequestException('No tiene acceso a este parqueadero');
    }

    return this.parqueaderoVehiculoRepository
        .createQueryBuilder('vp')
        .select("vp.placaVehiculo", 'placaVehiculo')
        .innerJoin("vp.parqueadero", "p")
        .where('p.idParqueadero = :idParqueadero', {idParqueadero})
        .groupBy('vp.placaVehiculo')
        .having('COUNT(vp.placaVehiculo) = 1')
        .getRawMany();
  }
  
  async consultarGanaciasPorParqueadero(idParqueadero: number, usuario: IUsuarioActivo, rangoTiempo: string) {

    const parqueadero = await this.parqueaderoService.consultarParqueaderoPorId(idParqueadero);

    if(parqueadero.idUsuario !== usuario.idUsuario) {
      throw new UnauthorizedException('No tiene acceso a este parqueadero');
    }

    // Obtener la fecha de hoy
    const fechaHoy = new Date();

    let fechaInicio = new Date();
    fechaInicio.setHours(0, 0, 0, 0);
    let fechaFin = new Date();
    fechaFin.setHours(23, 59, 59, 999);

    if(rangoTiempo == RANGOTIEMPO.semana) {

      fechaInicio.setDate(fechaInicio.getDate() - 6);
      fechaFin = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth(), fechaHoy.getDate(), 23, 59, 59, 999); // Fin del día de hoy

    } else if(rangoTiempo == RANGOTIEMPO.mes) {
        
      // Primer día del mes actual
      fechaInicio.setDate(1); 
        
      fechaFin = new Date(fechaInicio);
      // Primer día del próximo mes
      fechaFin.setMonth(fechaFin.getMonth() + 1);

    } else if(rangoTiempo == RANGOTIEMPO.año) {
        // Primer día del año actual
        fechaInicio = new Date(new Date().getFullYear(), 0, 1);
        
        // Último día del año actual
        fechaFin = new Date(new Date().getFullYear() + 1, 0, 1);
    }

    const ganancias = await this.parqueaderoVehiculoRepository.sum("valorTiempo", {
      fechaCreacion: Between(fechaInicio, fechaFin),
      estadoActivo: ESTADOS.INACTIVO,
      parqueadero: {
        idParqueadero: idParqueadero
      }
    });

    return (ganancias) ? ganancias : 0;
  }
  
  async consultarVehiculoPorPlaca(placa: string, usuario: IUsuarioActivo) {

    let vehiculos = [];
    if(usuario.rol == Rol.ADMIN) {
      vehiculos = await this.parqueaderoVehiculoRepository.find({
        relations: {
          parqueadero: true
        },
        select: {
          parqueadero: {
            idParqueadero: true
          }
        },
        where: {
          placaVehiculo: Like(`%${placa}%`)
        }
      });
    } else {
      vehiculos = await this.parqueaderoVehiculoRepository.find({
        relations: {
          parqueadero: true
        },
        select: {
          parqueadero: {
            idParqueadero: true
          }
        },
        where: {
          placaVehiculo: Like(`%${placa}%`),
          parqueadero: {
            idUsuario: usuario.idUsuario
         }
        }
      });
    }
    return {vehiculos}
  }
  
  async consultarVehiculoPorPlacaPipe(placa: string) {
    return await this.parqueaderoVehiculoRepository.findOne({
      where: {
        placaVehiculo: placa,
        estadoActivo: ESTADOS.ACTIVO
      },
      relations: {
        parqueadero:true
      },
      select: {
        parqueadero: {
          idParqueadero: true
        }
      }
    });
  }

  async consultarVehiculoPorParqueaderos(idParqueadero: number, estadoActivo: string, usuario: IUsuarioActivo) {

    const parqueadero = await this.parqueaderoService.consultarParqueaderoPorId(idParqueadero);

    if(usuario.rol === Rol.SOCIO && parqueadero.idUsuario != usuario.idUsuario) {
      throw new UnauthorizedException("No tiene acceso a este parqueadero");
    }

    let vehiculos = [];
    let donde: any = {
      parqueadero: {
        idParqueadero: idParqueadero
      }
    };

    if(estadoActivo) {
      if(estadoActivo == ESTADOSSTRING.ACTIVO) {
        donde.estadoActivo = ESTADOS.ACTIVO;
      } else {
        donde.estadoActivo = ESTADOS.INACTIVO;
      }
    }

    if(usuario.rol == Rol.SOCIO) {
      donde.parqueadero.idUsuario = usuario.idUsuario
    }

    vehiculos = await this.parqueaderoVehiculoRepository.find({
      relations: {
        parqueadero: true
      },
      select: {
        parqueadero: {
          idParqueadero: true
        }
      },
      where: donde
    });
    
    return {vehiculos}
  }
}
