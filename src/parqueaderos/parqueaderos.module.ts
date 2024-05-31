import { Module } from '@nestjs/common';
import { ParqueaderosService } from './parqueaderos.service';
import { ParqueaderosController } from './parqueaderos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parqueadero } from './entities/parqueadero.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parqueadero])],
  controllers: [ParqueaderosController],
  providers: [ParqueaderosService],
  exports: [TypeOrmModule]
})
export class ParqueaderosModule {}
