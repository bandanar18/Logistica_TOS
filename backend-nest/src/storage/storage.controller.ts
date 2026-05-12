import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('storage')
@UseGuards(JwtAuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('items')
  findAllItems() {
    return this.storageService.findAllItems();
  }

  @Post('receipts')
  receiveItem(@Body() data: any, @Request() req) {
    return this.storageService.receiveItem(data, req.user);
  }

  @Patch('items/:id/move')
  moveItem(
    @Param('id') id: string,
    @Body() moveDto: { toLocationId: number },
    @Request() req
  ) {
    return this.storageService.moveItem(+id, moveDto.toLocationId, req.user);
  }

  @Get('warehouses')
  findAllWarehouses() {
    return this.storageService.findAllWarehouses();
  }
}
