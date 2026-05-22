import { Controller, Get, Param } from '@nestjs/common';
import { EdificiosService } from './edificios.service';

@Controller('edificios')
export class EdificiosController {
  constructor(private readonly edificiosService: EdificiosService) {}

  @Get()
  async findAll() {
    return this.edificiosService.findAll();
  }

  @Get(':cui')
  async findOneByCui(@Param('cui') cui: string) {
    return this.edificiosService.findOneByCui(cui);
  }
}
