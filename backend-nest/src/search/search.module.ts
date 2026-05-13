import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { ServicesModule } from '../services/services.module';
import { CatalogsModule } from '../catalogs/catalogs.module';
import { StoresModule } from '../stores/stores.module';

@Module({
  imports: [ServicesModule, CatalogsModule, StoresModule],
  controllers: [SearchController],
})
export class SearchModule {}
