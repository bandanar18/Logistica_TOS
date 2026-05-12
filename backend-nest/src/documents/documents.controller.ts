import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DocumentsService } from './documents.service';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  create(@Body() data: any, @Request() req) {
    return this.documentsService.create(data, req.user);
  }

  @Get()
  findAll(@Request() req) {
    return this.documentsService.findAllForUser(req.user);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string, @Request() req) {
    return this.documentsService.updateStatus(+id, status, req.user);
  }
}
