import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MasterCatalog } from './entities/master-catalog.entity';
import { MasterCatalogItem } from './entities/master-catalog-item.entity';

@Injectable()
export class CatalogsService implements OnModuleInit {
  constructor(
    @InjectRepository(MasterCatalog)
    private catalogsRepository: Repository<MasterCatalog>,
    @InjectRepository(MasterCatalogItem)
    private itemsRepository: Repository<MasterCatalogItem>,
  ) {}

  async onModuleInit() {
    // Basic seed for required catalogs if empty
    const defaultCatalogs = [
      {
        code: 'SERVICE_CATEGORIES',
        name: 'Categorías de Servicio',
        items: [
          { code: 'ADUANA', name: 'Aduana' },
          { code: 'TRANSPORTE', name: 'Transporte Terrestre' },
          { code: 'ALMACENAJE', name: 'Almacenamiento' },
          { code: 'INSPECCION', name: 'Inspecciones' },
        ]
      },
      {
        code: 'PORTS',
        name: 'Puertos',
        items: [
          { code: 'VEPC', name: 'Puerto Cabello' },
          { code: 'VELAG', name: 'La Guaira' },
          { code: 'VEMCB', name: 'Maracaibo' },
        ]
      }
    ];

    for (const cat of defaultCatalogs) {
      let catalog = await this.catalogsRepository.findOne({ where: { code: cat.code } });
      if (!catalog) {
        catalog = await this.catalogsRepository.save({ code: cat.code, name: cat.name });
        for (const item of cat.items) {
          await this.itemsRepository.save({
            code: item.code,
            name: item.name,
            catalog: catalog
          });
        }
      }
    }
  }

  findAll() {
    return this.catalogsRepository.find({ relations: ['items'] });
  }

  findOne(code: string) {
    return this.catalogsRepository.findOne({ where: { code }, relations: ['items'] });
  }
}
