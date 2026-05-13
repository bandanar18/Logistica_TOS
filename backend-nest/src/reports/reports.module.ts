import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/entities/order.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Quotation } from '../quotations/entities/quotation.entity';
import { Store } from '../stores/entities/store.entity';
import { User } from '../users/entities/user.entity';
import { Trip } from '../transport/entities/trip.entity';
import { InventoryItem } from '../storage/entities/inventory-item.entity';
import { Commission } from '../commissions/entities/commission.entity';
import { CommissionRule } from '../commission_rules/entities/commission_rule.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, 
      Store, 
      Quotation, 
      Order, 
      Payment, 
      Trip, 
      InventoryItem, 
      Commission, 
      CommissionRule
    ])
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
