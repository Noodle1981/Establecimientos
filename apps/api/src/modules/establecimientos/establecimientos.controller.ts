import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { EstablecimientosService } from './establecimientos.service';

@Controller('establecimientos')
export class EstablecimientosController {
  constructor(private readonly establecimientosService: EstablecimientosService) {}

  @Get(':cue')
  async findOneByCue(@Param('cue', ParseIntPipe) cue: number) {
    return this.establecimientosService.findOneByCue(cue);
  }
}
