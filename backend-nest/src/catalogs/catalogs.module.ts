import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterCatalog } from './entities/master-catalog.entity';
import { MasterCatalogItem } from './entities/master-catalog-item.entity';
import { CatalogsService } from './catalogs.service';
import { CatalogsController } from './catalogs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MasterCatalog, MasterCatalogItem])],
  providers: [CatalogsService],
  controllers: [CatalogsController],
  exports: [CatalogsService, TypeOrmModule],
})
export class CatalogsModule {}
