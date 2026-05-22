import { Controller, Post, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { ValidacionesService } from './validaciones.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'administrativos')
@Controller('validaciones')
export class ValidacionesController {
  constructor(private readonly validacionesService: ValidacionesService) {}

  @Post(':id')
  async validateModality(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @Request() req: any,
  ) {
    return this.validacionesService.validateModality(id, body, req.user.id);
  }
}
