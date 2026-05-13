import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationsService } from './quotations.service';
import { QuotationsController } from './quotations.controller';
import { Quotation } from './entities/quotation.entity';
import { OrdersModule } from '../orders/orders.module';
import { Store } from '../stores/entities/store.entity';
import { Service } from '../services/entities/service.entity';
import { CommissionRulesModule } from '../commission_rules/commission_rules.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quotation, Store, Service]),
    OrdersModule,
    CommissionRulesModule,
  ],
  controllers: [QuotationsController],
  providers: [QuotationsService],
  exports: [QuotationsService],
})
export class QuotationsModule {}
