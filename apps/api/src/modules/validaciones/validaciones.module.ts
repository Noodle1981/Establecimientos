import { Module } from '@nestjs/common';
import { ValidacionesService } from './validaciones.service';
import { ValidacionesController } from './validaciones.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ValidacionesController],
  providers: [ValidacionesService],
  exports: [ValidacionesService],
})
export class ValidacionesModule {}
