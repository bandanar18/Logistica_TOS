import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { StoresService } from './stores.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @UseGuards(JwtAuthGuard)
  @Post('me')
  createOrUpdate(@Request() req, @Body() storeData: any) {
    return this.storesService.createOrUpdate(req.user.sub, storeData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMyStore(@Request() req) {
    return this.storesService.findByOwner(req.user.sub);
  }

  @Get('public/:id')
  findOnePublic(@Param('id') id: string) {
    return this.storesService.findOnePublic(+id);
  }
}
