import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommissionRulesService } from './commission_rules.service';
import { CommissionRulesController } from './commission_rules.controller';
import { CommissionRule } from './entities/commission_rule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommissionRule])],
  controllers: [CommissionRulesController],
  providers: [CommissionRulesService],
  exports: [CommissionRulesService],
})
export class CommissionRulesModule {}
