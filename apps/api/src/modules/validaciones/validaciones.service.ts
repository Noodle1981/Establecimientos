import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ValidacionesService {
  constructor(private readonly prisma: PrismaService) {}

  async validateModality(id: number, dto: any, auditorId: number) {
    const { estado, observaciones } = dto;

    // Enforce Business Rule: Observations required for CORREGIDO, REVISAR, BAJA and must be >= 10 chars
    const requiresComments = ['CORREGIDO', 'REVISAR', 'BAJA'].includes(estado);
    if (requiresComments && (!observaciones || observaciones.trim().length < 10)) {
      throw new BadRequestException(
        'Las observaciones son estrictamente obligatorias (mínimo 10 caracteres) para el estado seleccionado.',
      );
    }

    // Check modality existence
    const modality = await this.prisma.modalidad.findUnique({
      where: { id: BigInt(id) },
    });

    if (!modality) {
      throw new NotFoundException(`Modalidad con ID ${id} no encontrada.`);
    }

    // Run transacted audit mutations
    return this.prisma.$transaction(async (tx) => {
      // Update modality state
      const updated = await tx.modalidad.update({
        where: { id: BigInt(id) },
        data: {
          estadoValidacion: estado,
          validado: ['CORRECTO', 'CORREGIDO'].includes(estado),
          validadoPorUserId: BigInt(auditorId),
          validadoEn: new Date(),
          observaciones: observaciones || null,
        },
      });

      // Insert historical tracking row
      await tx.historialEstadoModalidad.create({
        data: {
          modalidadId: BigInt(id),
          userId: BigInt(auditorId),
          estadoAnterior: modality.estadoValidacion,
          estadoNuevo: estado,
          observaciones: observaciones || null,
        },
      });

      // Insert activity log record
      await tx.activityLog.create({
        data: {
          userId: BigInt(auditorId),
          action: 'CAMBIO_ESTADO',
          modelType: 'Modalidad',
          modelId: BigInt(id),
          description: `Modificó estado de validación de ID ${modality.id} a ${estado}`,
          changes: { estadoAnterior: modality.estadoValidacion, estadoNuevo: estado },
        },
      });

      return updated;
    });
  }
}
