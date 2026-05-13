import { Controller, Get, Query } from '@nestjs/common';
import { ServicesService } from '../services/services.service';
import { CatalogsService } from '../catalogs/catalogs.service';
import { StoresService } from '../stores/stores.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(
    private readonly servicesService: ServicesService,
    private readonly catalogsService: CatalogsService,
    private readonly storesService: StoresService,
  ) {}

  @Get('services')
  @ApiOperation({ summary: 'Buscar servicios publicados' })
  searchServices(@Query() query: any) {
    return this.servicesService.searchPublicServices(query);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Listar categorías para búsqueda' })
  async searchCategories() {
    return this.catalogsService.findByCode('SERVICE_CATEGORIES');
  }

  @Get('stores')
  @ApiOperation({ summary: 'Buscar tiendas aprobadas' })
  searchStores(@Query() query: any) {
    // Basic implementation for now
    return this.storesService.findAll(); 
  }
}
