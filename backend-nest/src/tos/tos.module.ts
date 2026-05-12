import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TosService } from './tos.service';
import { TosController } from './tos.controller';
import { Container } from './entities/container.entity';
import { Yard } from './entities/yard.entity';
import { Move } from './entities/move.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Container, Yard, Move])],
  controllers: [TosController],
  providers: [TosService],
})
export class TosModule {}
