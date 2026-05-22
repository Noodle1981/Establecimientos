import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EdificiosService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.edificio.findMany({
      where: { deleted_at: null },
      include: {
        establecimientos: {
          include: {
            modalidades: true,
          },
        },
      },
    });
  }

  async findOneByCui(cui: string) {
    const edificio = await this.prisma.edificio.findUnique({
      where: { cui },
      include: {
        establecimientos: {
          include: {
            modalidades: true,
          },
        },
      },
    });

    if (!edificio) {
      throw new NotFoundException(`Edificio con CUI ${cui} no encontrado.`);
    }

    return edificio;
  }
}
