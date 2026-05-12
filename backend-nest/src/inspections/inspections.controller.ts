import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { InspectionsService } from './inspections.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('inspections')
@UseGuards(JwtAuthGuard)
export class InspectionsController {
  constructor(private readonly inspectionsService: InspectionsService) {}

  @Get()
  findAll() {
    return this.inspectionsService.findAll();
  }

  @Post()
  create(@Body() data: any, @Request() req) {
    return this.inspectionsService.create(data, req.user);
  }

  @Post(':id/results')
  saveResult(
    @Param('id') id: string,
    @Body() resultData: any,
    @Request() req
  ) {
    return this.inspectionsService.saveResult(+id, resultData, req.user);
  }
}
