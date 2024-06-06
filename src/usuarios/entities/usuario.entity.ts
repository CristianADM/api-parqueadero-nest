import { Rol } from "../../common/enums/rol.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Usuario {

    @PrimaryGeneratedColumn({name: "id_usuario"})
    idUsuario: number;

    @Column({unique: true, nullable: false})
    correo: string;

    @Column()
    nombre: string;

    @Column({select: false, nullable: false})
    contrasenna: string;

    @Column({type: 'enum', default: Rol.SOCIO, enum: Rol})
    rol: string;
    
    @Column({nullable: true})
    token: string;

    @Column({name: 'estado_activo', default: true})
    estadoActivo: boolean;

    @CreateDateColumn({name: 'fecha_creacion'})
    fechaCreacion: Date;

    @UpdateDateColumn({name: 'fecha_modificacion'})
    fechaModificacion: Date;
}
