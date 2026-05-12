import { Controller, Get, Param } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';

@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  @Get()
  findAll() {
    return this.catalogsService.findAll();
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.catalogsService.findOne(code);
  }
}
