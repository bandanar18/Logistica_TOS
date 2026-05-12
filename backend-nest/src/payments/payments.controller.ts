import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() createDto: any, @Request() req) {
    return this.paymentsService.create(createDto, req.user);
  }

  @Get()
  findAll(@Request() req) {
    return this.paymentsService.findAllForUser(req.user);
  }

  @Patch(':id/confirm')
  confirm(@Param('id') id: string, @Request() req) {
    return this.paymentsService.confirm(+id, req.user);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string, @Body('reason') reason: string, @Request() req) {
    return this.paymentsService.reject(+id, reason, req.user);
  }
}
