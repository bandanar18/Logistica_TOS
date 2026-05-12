import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { QuotationsService } from './quotations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from '../orders/orders.service';

@Controller('quotations')
@UseGuards(JwtAuthGuard)
export class QuotationsController {
  constructor(
    private readonly quotationsService: QuotationsService,
    private readonly ordersService: OrdersService,
  ) {}

  @Post()
  create(@Body() createDto: any, @Request() req) {
    return this.quotationsService.create(createDto, req.user);
  }

  @Get()
  findAll(@Request() req) {
    return this.quotationsService.findAllForUser(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quotationsService.findOne(+id);
  }

  @Patch(':id/respond')
  respond(@Param('id') id: string, @Body() respondDto: any, @Request() req) {
    return this.quotationsService.respond(+id, respondDto, req.user);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string, @Request() req) {
    return this.quotationsService.updateStatus(+id, status, req.user);
  }

  @Post(':id/convert-to-order')
  async convertToOrder(@Param('id') id: string, @Request() req) {
    const q = await this.quotationsService.findOne(+id);
    if (q.client.id !== (req.user.sub || req.user.id)) {
      throw new ForbiddenException('Only the client can convert the quotation to an order');
    }
    if (q.status !== 'approved') {
       throw new ForbiddenException('Quotation must be approved to be converted to an order');
    }
    const order = await this.ordersService.createFromQuotation(q);
    await this.quotationsService.updateStatus(+id, 'order_created', req.user);
    return order;
  }
}
