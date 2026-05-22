import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EstablecimientosService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneByCue(cue: number) {
    const establecimiento = await this.prisma.establecimiento.findUnique({
      where: { cue: BigInt(cue) },
      include: {
        edificio: true,
        modalidades: true,
      },
    });

    if (!establecimiento) {
      throw new NotFoundException(`Establecimiento con CUE ${cue} no encontrado.`);
    }

    return establecimiento;
  }
}
