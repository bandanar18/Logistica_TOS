import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  @Roles('admin')
  getSummary() {
    return this.reportsService.getExecutiveSummary();
  }

  @Get('store-dashboard')
  @Roles('store')
  getStoreDashboard(@Request() req) {
    return this.reportsService.getStoreDashboard(req.user.storeId);
  }

  @Get('client-dashboard')
  @Roles('client')
  getClientDashboard(@Request() req) {
    return this.reportsService.getClientDashboard(req.user.id);
  }
}
