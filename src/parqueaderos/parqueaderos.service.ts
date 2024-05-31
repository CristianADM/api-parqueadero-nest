import { Injectable } from '@nestjs/common';
import { CreateParqueaderoDto } from './dto/create-parqueadero.dto';
import { UpdateParqueaderoDto } from './dto/update-parqueadero.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Parqueadero } from './entities/parqueadero.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ParqueaderosService {

  constructor(
    @InjectRepository(Parqueadero) private readonly parqueaderoRepository: Repository<Parqueadero>) {
  }

  async create(createParqueaderoDto: CreateParqueaderoDto) {
    const parqueadero = this.parqueaderoRepository.create(createParqueaderoDto);
    parqueadero.espaciosDisponibles = createParqueaderoDto.capacidadVehiculos;
    return await this.parqueaderoRepository.save(parqueadero);
  }

  async findAll() {
    return await this.parqueaderoRepository.find();
  }

  async findOneById(id: number) {
    return await this.parqueaderoRepository.findOneBy({
      idParqueadero: id
    });
  }

  async update(id: number, updateParqueaderoDto: UpdateParqueaderoDto) {
    let parqueadero: Parqueadero;

    if(updateParqueaderoDto.capacidadVehiculos) {
      parqueadero = await this.parqueaderoRepository.findOneBy({
        idParqueadero: id
      });
      
      const espaciosDisponibles = updateParqueaderoDto.capacidadVehiculos - parqueadero.espaciosDisponibles;

      if(espaciosDisponibles < 0) {
        //TODO: Devolver un error!
      }
    }
    return await this.parqueaderoRepository.update(id, updateParqueaderoDto);
  }

  async remove(id: number) {
    const parqueadero = await this.parqueaderoRepository.findOneBy({
      idParqueadero: id
    });

    if(parqueadero) {
      parqueadero.estadoActivo = false;
      parqueadero.fechaModificacion = new Date();
    }
    
    return await this.parqueaderoRepository.save(parqueadero);
  }
}
