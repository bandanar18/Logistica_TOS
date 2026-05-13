import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() serviceData: any) {
    return this.servicesService.create(req.user.sub, serviceData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('store')
  findStoreServices(@Request() req) {
    return this.servicesService.findByStoreOwner(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Listar servicios' })
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ver servicio' })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar servicio' })
  update(@Param('id') id: string, @Request() req, @Body() data: any) {
    return this.servicesService.update(+id, req.user.sub, data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/publish')
  @ApiOperation({ summary: 'Publicar servicio' })
  publish(@Param('id') id: string, @Request() req) {
    return this.servicesService.update(+id, req.user.sub, { status: 'published' });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/pause')
  @ApiOperation({ summary: 'Pausar servicio' })
  pause(@Param('id') id: string, @Request() req) {
    return this.servicesService.update(+id, req.user.sub, { status: 'paused' });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar servicio' })
  remove(@Param('id') id: string, @Request() req) {
    return this.servicesService.remove(+id, req.user.sub);
  }
}
