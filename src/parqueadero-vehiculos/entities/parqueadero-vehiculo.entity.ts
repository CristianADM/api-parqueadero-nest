import { Parqueadero } from "../../parqueaderos/entities/parqueadero.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ParqueaderoVehiculo {

    @PrimaryGeneratedColumn({name: "id_parqueadero_vehiculo"})
    idParqueaderoVehiculo: number;

    @ManyToOne(() => Parqueadero)
    @JoinColumn({name: "id_parqueadero"})
    parqueadero: Parqueadero;

    @Column({name: "placa_vehiculo", length: 6, nullable: false})
    placaVehiculo: string;

    @Column({name: "fecha_ingreso"})
    fechaIngreso: Date;

    @Column({name: "fecha_salida", nullable: true})
    fechaSalida: Date;

    @Column({name: "valor_tiempo", nullable: true})
    valorTiempo: number;

    @Column({name: "estado_activo", default: true})
    estadoActivo: boolean;

    @CreateDateColumn({name: "fecha_creacion"})
    fechaCreacion: Date;

    @UpdateDateColumn({name: "fecha_modificacion"})
    fechaModificacion: Date;
}
