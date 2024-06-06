import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateParqueaderoDto } from './dto/create-parqueadero.dto';
import { UpdateParqueaderoDto } from './dto/update-parqueadero.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Parqueadero } from './entities/parqueadero.entity';
import { Repository } from 'typeorm';
import { ESTADOS } from '../common/constantes/constantes';
import { IUsuarioActivo } from '../common/interfaces/user-active.interfaces';
import { ParqueaderoVehiculosService } from '../parqueadero-vehiculos/parqueadero-vehiculos.service';

@Injectable()
export class ParqueaderosService {

  constructor(
    @InjectRepository(Parqueadero) private readonly parqueaderoRepository: Repository<Parqueadero>,
    @Inject(forwardRef(() => ParqueaderoVehiculosService))
    private parqueaderoVehiculosService: ParqueaderoVehiculosService,
  ) {
  }

  async create(createParqueaderoDto: CreateParqueaderoDto) {
    
    let parqueadero = this.parqueaderoRepository.create(createParqueaderoDto);
    parqueadero.espaciosDisponibles = createParqueaderoDto.capacidadVehiculos;
    return await this.parqueaderoRepository.save(parqueadero);
  }

  async consultarParqueaderosAdministrador() {
    return await this.parqueaderoRepository.find({
      relations: {
        usuario: true
      },
      select: {
        usuario: {
          idUsuario: true,
          nombre:true,
          correo: true
        }
      }
    });
  }
  
  async consultarParqueaderosSocio(usuario: IUsuarioActivo) {
    return await this.parqueaderoRepository.find({
      relations: {
        usuario: true
      },
      select: {
        usuario: {
          idUsuario: true,
          nombre:true,
          correo: true
        }
      },
      where: {
        usuario: {
          correo: usuario.correo
        }
      }
    });
  }

  async consultarParqueaderoPorId(id: number) {
    return await this.parqueaderoRepository.findOneBy({
      idParqueadero: id,
      estadoActivo: ESTADOS.ACTIVO
    });
  }
  
  async consultarParqueaderoPorNombre(nombre: string) {
    return await this.parqueaderoRepository.findOneBy({
      nombre: nombre,
      estadoActivo: ESTADOS.ACTIVO
    });
  }

  async update(id: number, updateParqueaderoDto: UpdateParqueaderoDto) {
    
    let pq = {};

    if(updateParqueaderoDto.capacidadVehiculos) {
      const cantidadVehiculos = await this.parqueaderoVehiculosService.cantidadVehiculosActivosPorIdParqueadero(id);

      const espaciosDisponibles = updateParqueaderoDto.capacidadVehiculos - cantidadVehiculos;

      if(espaciosDisponibles < 0) {
        throw new BadRequestException('La capacidad de vehículos es menor a los vehículos registrados');
      }
      pq = {...updateParqueaderoDto, espaciosDisponibles}
    }

    return await this.parqueaderoRepository.update(id, pq);
  }

  async restarEspcioDisponible(idParqueadero: number) {
    const parqueadero = await this.parqueaderoRepository.findOneBy({
      idParqueadero
    });

    this.parqueaderoRepository.update(idParqueadero, {espaciosDisponibles: --parqueadero.espaciosDisponibles})
  }
  
  async sumarEspcioDisponible(idParqueadero: number) {
    const parqueadero = await this.parqueaderoRepository.findOneBy({
      idParqueadero
    });

    this.parqueaderoRepository.update(idParqueadero, {espaciosDisponibles: ++parqueadero.espaciosDisponibles})
  }

  async remove(id: number) {
    const parqueadero = await this.parqueaderoRepository.findOneBy({
      idParqueadero: id
    });
    parqueadero.estadoActivo = false;
    return await this.parqueaderoRepository.save(parqueadero);
  }
}
