import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateParqueaderoVehiculoDto } from './dto/create-parqueadero-vehiculo.dto';
import { UpdateParqueaderoVehiculoDto } from './dto/update-parqueadero-vehiculo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ParqueaderoVehiculo } from './entities/parqueadero-vehiculo.entity';
import { Repository } from 'typeorm';
import { Parqueadero } from 'src/parqueaderos/entities/parqueadero.entity';

@Injectable()
export class ParqueaderoVehiculosService {

  constructor(
    @InjectRepository(ParqueaderoVehiculo) private readonly parqueaderoVehiculoRepository: Repository<ParqueaderoVehiculo>,
    @InjectRepository(Parqueadero) private readonly parqueaderoRepository: Repository<Parqueadero>
  ) { }

  async registroIngreso(createParqueaderoVehiculoDto: CreateParqueaderoVehiculoDto) {

    const parqueadero = await this.parqueaderoRepository.findOneBy({
      idParqueadero: createParqueaderoVehiculoDto.idParqueadero,
      estadoActivo: true
    });

    if(!parqueadero) {
      throw new NotFoundException("No existe parqueadero registrado con ese IdParqueadero");
    }

    const parqueaderoVehiculo = this.parqueaderoVehiculoRepository.create({
      parqueadero,
      ...createParqueaderoVehiculoDto
    });
    parqueaderoVehiculo.fechaIngreso = new Date();
    return await this.parqueaderoVehiculoRepository.save(parqueaderoVehiculo);
  }

  async findAll() {
    return this.parqueaderoVehiculoRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} parqueaderoVehiculo`;
  }

  update(id: number, updateParqueaderoVehiculoDto: UpdateParqueaderoVehiculoDto) {
    return `This action updates a #${id} parqueaderoVehiculo`;
  }
  
  async salidaVehiculo(updateParqueaderoVehiculoDto: UpdateParqueaderoVehiculoDto) {

    const parqueadero = await this.parqueaderoRepository.findOneBy({
      idParqueadero: updateParqueaderoVehiculoDto.idParqueadero,
      estadoActivo: true
    });

    if(!parqueadero) {
      throw new NotFoundException("No existe parqueadero con ese idParqueadero.");
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

    console.log(parqueadero)
    console.log(vehiculo)

    if(!vehiculo) {
      throw new NotFoundException("El vehiculo no esta registrado en este parqueadero.");
    }

    vehiculo.estadoActivo = false;
    vehiculo.fechaSalida = new Date();
    const horasParqueado = (vehiculo.fechaSalida.getTime() - vehiculo.fechaIngreso.getTime()) / (1000 * 3600);

    vehiculo.valorTiempo = horasParqueado * parqueadero.valorHora;

    return await this.parqueaderoVehiculoRepository.update(vehiculo.idParqueaderoVehiculo, vehiculo);
  }

  remove(id: number) {
    return `This action removes a #${id} parqueaderoVehiculo`;
  }
}
