import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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

  @Get('search')
  search(@Query() query: any) {
    return this.servicesService.searchPublicServices(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Request() req, @Body() data: any) {
    return this.servicesService.update(+id, req.user.sub, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.servicesService.remove(+id, req.user.sub);
  }
}
