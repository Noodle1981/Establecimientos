import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Query, 
  Param, 
  Delete, 
  Put, 
  Res, 
  UseGuards, 
  ParseIntPipe 
} from '@nestjs/common';
import { ModalidadesService } from './modalidades.service';


@Controller('modalidades')
export class ModalidadesController {
  constructor(private readonly service: ModalidadesService) {}

  @Get()
  async findAll(@Query() query: any) {
    const skip = query.skip ? parseInt(query.skip, 10) : 0;
    const take = query.take ? parseInt(query.take, 10) : 20;
    const sectorFilter = query.sectorFilter ? parseInt(query.sectorFilter, 10) : undefined;
    const conObservacionesFilter = query.conObservacionesFilter === 'true';
    const showDeleted = query.showDeleted === 'true';

    return this.service.findAll({
      skip,
      take,
      search: query.search,
      nivelFilter: query.nivelFilter,
      ambitoFilter: query.ambitoFilter,
      radioFilter: query.radioFilter,
      categoriaFilter: query.categoriaFilter,
      zonaFilter: query.zonaFilter,
      sectorFilter,
      direccionAreaFilter: query.direccionAreaFilter,
      estadoFilter: query.estadoFilter,
      zonaLetraFilter: query.zonaLetraFilter,
      conObservacionesFilter,
      showDeleted,
    });
  }

  @Get('export')
  async exportExcel(@Res() res: any, @Query() query: any) {
    const sectorFilter = query.sectorFilter ? parseInt(query.sectorFilter, 10) : undefined;
    const conObservacionesFilter = query.conObservacionesFilter === 'true';
    const showDeleted = query.showDeleted === 'true';

    return this.service.exportExcel(res, {
      search: query.search,
      nivelFilter: query.nivelFilter,
      ambitoFilter: query.ambitoFilter,
      radioFilter: query.radioFilter,
      categoriaFilter: query.categoriaFilter,
      zonaFilter: query.zonaFilter,
      sectorFilter,
      direccionAreaFilter: query.direccionAreaFilter,
      estadoFilter: query.estadoFilter,
      zonaLetraFilter: query.zonaLetraFilter,
      conObservacionesFilter,
      showDeleted,
    });
  }

  @Get('lookup/edificio/:cui')
  async lookupEdificioByCui(@Param('cui') cui: string) {
    return this.service.lookupEdificioByCui(cui);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  async create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Delete(':id')
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.service.softDelete(id);
  }

  @Put(':id/restore')
  async restore(@Param('id', ParseIntPipe) id: number) {
    return this.service.restore(id);
  }
}
