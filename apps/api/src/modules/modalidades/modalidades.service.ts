import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Ambito } from '@sue/database';
import * as ExcelJS from 'exceljs';


@Injectable()
export class ModalidadesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
    nivelFilter?: string;
    ambitoFilter?: string;
    radioFilter?: string;
    categoriaFilter?: string;
    zonaFilter?: string;
    sectorFilter?: number;
    direccionAreaFilter?: string;
    estadoFilter?: string;
    zonaLetraFilter?: string;
    conObservacionesFilter?: boolean;
    showDeleted?: boolean;
  }) {
    const {
      skip = 0,
      take = 20,
      search,
      nivelFilter,
      ambitoFilter,
      radioFilter,
      categoriaFilter,
      zonaFilter,
      sectorFilter,
      direccionAreaFilter,
      estadoFilter,
      zonaLetraFilter,
      conObservacionesFilter,
      showDeleted = false,
    } = params;

    // Build Prisma query filters dynamically matching the legacy Laravel ModalidadesTable
    const where: Prisma.ModalidadWhereInput = {};

    if (showDeleted) {
      where.deletedAt = { not: null };
    } else {
      where.deletedAt = null;
    }

    // Build dynamic conditions for establishment/building nested relationships
    const establishmentConditions: Prisma.EstablecimientoWhereInput[] = [];

    if (search) {
      const orConditions: Prisma.EstablecimientoWhereInput[] = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { edificio: { cui: { contains: search, mode: 'insensitive' } } },
      ];

      // If search is a valid CUE number, search by exact cue
      const numericCue = parseInt(search, 10);
      if (!isNaN(numericCue)) {
        orConditions.push({ cue: BigInt(numericCue) });
      }

      establishmentConditions.push({ OR: orConditions });
    }

    if (zonaFilter) {
      establishmentConditions.push({
        edificio: {
          zonaDepartamento: { contains: zonaFilter.trim(), mode: 'insensitive' },
        },
      });
    }

    if (establishmentConditions.length > 0) {
      where.establecimiento = {
        AND: establishmentConditions,
      };
    }

    if (nivelFilter) {
      where.nivelEducativo = nivelFilter;
    }

    if (ambitoFilter) {
      where.ambito = (ambitoFilter as Ambito);
    }

    if (radioFilter) {
      // Cast decimal strings
      where.radio = new Prisma.Decimal(radioFilter);
    }

    if (categoriaFilter) {
      where.categoria = { contains: categoriaFilter, mode: 'insensitive' };
    }

    if (sectorFilter !== undefined) {
      where.sector = sectorFilter;
    }

    if (direccionAreaFilter) {
      where.direccionArea = direccionAreaFilter;
    }

    if (estadoFilter) {
      if (estadoFilter === 'VALIDADO') {
        where.validado = true;
      } else if (estadoFilter === 'PENDIENTE') {
        where.validado = false;
      }
    }

    if (zonaLetraFilter) {
      where.zona = zonaLetraFilter.trim();
    }

    if (conObservacionesFilter) {
      where.observaciones = { not: '', mode: 'insensitive' };
    }

    const [total, data] = await Promise.all([
      this.prisma.modalidad.count({ where }),
      this.prisma.modalidad.findMany({
        where,
        skip,
        take,
        include: {
          establecimiento: {
            include: {
              edificio: true,
            },
          },
          usuarioValidacion: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, data, skip, take };
  }

  async findOne(id: number) {
    const modality = await this.prisma.modalidad.findFirst({
      where: { id: BigInt(id), deletedAt: null },
      include: {
        establecimiento: {
          include: {
            edificio: true,
          },
        },
        usuarioValidacion: true,
        historialEstados: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!modality) {
      throw new NotFoundException(`Modalidad with ID ${id} not found.`);
    }

    return modality;
  }

  async lookupEdificioByCui(cui: string) {
    const edificio = await this.prisma.edificio.findUnique({
      where: { cui },
      include: {
        establecimientos: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!edificio) {
      throw new NotFoundException(`No building matches CUI ${cui}`);
    }

    // Determine establishment principal cabecera
    const cabecera = edificio.establecimientos.find(
      (e: any) => e.cue === e.cueEdificioPrincipal,
    );

    return {
      edificio,
      cabeceraNombre: cabecera ? cabecera.nombre : null,
    };
  }

  async create(dto: any) {
    const {
      nombre_establecimiento,
      cue,
      cui,
      establecimiento_cabecera,
      nivel_educativo,
      direccion_area,
      sector,
      radio,
      zona,
      observaciones,
      categoria,
      ambito,
      zona_departamento,
      localidad,
      calle,
      numero_puerta,
      validado,
      latitud,
      longitud,
    } = dto;

    // Verify constraints like Laravel regex validations
    if (!/^\d{9}$|^PROV.*$/.test(cue)) {
      throw new BadRequestException('El CUE debe tener 9 dígitos o iniciar con "PROV"');
    }
    if (!/^\d{7}$|^PROV.*$/.test(cui)) {
      throw new BadRequestException('El CUI debe tener 7 dígitos o iniciar con "PROV"');
    }

    // Convert cue input appropriately for database BigInt
    const parsedCue = BigInt(cue);

    return this.prisma.$transaction(async (tx: any) => {
      // Find or create building
      const edificio = await tx.edificio.upsert({
        where: { cui },
        create: {
          cui,
          calle: calle.toUpperCase(),
          numeroPuerta: numero_puerta || 'S/N',
          localidad: localidad.toUpperCase(),
          zonaDepartamento: zona_departamento.toUpperCase(),
          latitud: latitud ? new Prisma.Decimal(latitud) : 0,
          longitud: longitud ? new Prisma.Decimal(longitud) : 0,
        },
        update: {},
      });

      // Find or create establishment
      const establecimiento = await tx.establecimiento.upsert({
        where: { cue: parsedCue },
        create: {
          edificioId: edificio.id,
          cue: parsedCue,
          nombre: nombre_establecimiento.toUpperCase(),
          establecimientoCabecera: establecimiento_cabecera ? establecimiento_cabecera.toUpperCase() : null,
          cueEdificioPrincipal: parsedCue,
        },
        update: {},
      });

      // Create Modalidad
      return tx.modalidad.create({
        data: {
          establecimientoId: establecimiento.id,
          direccionArea: direccion_area,
          nivelEducativo: nivel_educativo,
          sector: sector ? parseInt(sector, 10) : 1,
          radio: radio ? new Prisma.Decimal(radio) : null,
          zona: zona ? zona.toUpperCase() : null,
          categoria: categoria ? categoria.toUpperCase() : null,
          ambito: (ambito || 'PUBLICO') as any, // Casts to Ambito enum
          validado: !!validado,
          estadoValidacion: validado ? 'CORRECTO' : 'PENDIENTE',
          observaciones: observaciones || null,
        },
      });
    });
  }

  async softDelete(id: number) {
    await this.findOne(id); // Assures existence
    return this.prisma.modalidad.update({
      where: { id: BigInt(id) },
      data: { deletedAt: new Date(), estadoValidacion: 'ELIMINADO' },
    });
  }

  async restore(id: number) {
    const modality = await this.prisma.modalidad.findUnique({ where: { id: BigInt(id) } });
    if (!modality || !modality.deletedAt) {
      throw new BadRequestException('Modalidad is not deleted or does not exist.');
    }

    return this.prisma.modalidad.update({
      where: { id: BigInt(id) },
      data: { deletedAt: null, estadoValidacion: 'PENDIENTE' },
    });
  }

  async exportExcel(res: any, queryParams: any) {
    const { data } = await this.findAll({ ...queryParams, take: 50000 }); // Large limit for export

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Establecimientos');

    // Define columns
    sheet.columns = [
      { header: 'CUE', key: 'cue', width: 12 },
      { header: 'CUI', key: 'cui', width: 10 },
      { header: 'NOMBRE ESTABLECIMIENTO', key: 'nombre', width: 35 },
      { header: 'NIVEL', key: 'nivel', width: 20 },
      { header: 'DIRECCIÓN DE ÁREA', key: 'area', width: 25 },
      { header: 'SECTOR', key: 'sector', width: 10 },
      { header: 'ÁMBITO', key: 'ambito', width: 12 },
      { header: 'ZONA EDUC.', key: 'zona', width: 12 },
      { header: 'RADIO', key: 'radio', width: 10 },
      { header: 'CATEGORÍA', key: 'categoria', width: 15 },
      { header: 'DEPARTAMENTO', key: 'departamento', width: 20 },
      { header: 'LOCALIDAD', key: 'localidad', width: 20 },
      { header: 'CALLE', key: 'calle', width: 30 },
      { header: 'N°', key: 'numero', width: 8 },
      { header: 'ESTADO', key: 'estado', width: 15 },
      { header: 'OBSERVACIONES', key: 'observaciones', width: 30 },
    ];

    // Style Header Row (Orange brand color matching Laravel)
    const headerRow = sheet.getRow(1);
    headerRow.height = 25;
    headerRow.eachCell((cell: any) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FE8204' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 11,
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Populate rows
    data.forEach((item: any) => {
      const row = sheet.addRow({
        cue: item.establecimiento.cue,
        cui: item.establecimiento.edificio.cui,
        nombre: item.establecimiento.nombre,
        nivel: item.nivelEducativo,
        area: item.direccionArea,
        sector: item.sector === 1 ? 'ESTATAL' : 'PRIVADO',
        ambito: item.ambito,
        zona: item.zona || 'N/A',
        radio: item.radio || 'N/A',
        categoria: item.categoria || 'N/A',
        departamento: item.establecimiento.edificio.zonaDepartamento,
        localidad: item.establecimiento.edificio.localidad,
        calle: item.establecimiento.edificio.calle,
        numero: item.establecimiento.edificio.numeroPuerta,
        estado: item.validado ? 'VALIDADO' : 'PENDIENTE',
        observaciones: item.observaciones || '',
      });

      // Highlight validation state
      const stateCell = row.getCell('estado');
      if (item.validado) {
        stateCell.font = { color: { argb: '008000' }, bold: true };
      } else {
        stateCell.font = { color: { argb: 'FF0000' }, bold: true };
      }
    });

    // Set headers and trigger streaming download
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=establecimientos_${Date.now()}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  }
}
