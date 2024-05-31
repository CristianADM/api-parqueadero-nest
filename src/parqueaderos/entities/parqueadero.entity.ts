import { ParqueaderoVehiculo } from 'src/parqueadero-vehiculos/entities/parqueadero-vehiculo.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Parqueadero {

  @PrimaryGeneratedColumn({name: "id_parqueadero"})
  idParqueadero: number;

  @Column({length: 100, nullable: false})
  nombre: string;

  @Column({name: "valor_hora", nullable: false})
  valorHora: number;

  @Column({name: "capcidad_vehiculos", nullable: false})
  capacidadVehiculos: number;

  @Column({name: "espacios_disponibles"})
  espaciosDisponibles: number;

  @Column({name: "estado_activo", default: true})
  estadoActivo: boolean;

  @CreateDateColumn({name: "fecha_creacion"})
  fechaCreacion: Date;

  @UpdateDateColumn({name: "fecha_modificacion"})
  fechaModificacion: Date;

  @OneToMany(() => ParqueaderoVehiculo, (parqueaderoVehiculo) => parqueaderoVehiculo.parqueadero)
  parqueaderoVehiculos: ParqueaderoVehiculo[];
}
