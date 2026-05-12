import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { TosService } from './tos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tos')
@UseGuards(JwtAuthGuard)
export class TosController {
  constructor(private readonly tosService: TosService) {}

  @Get('containers')
  findAllContainers() {
    return this.tosService.findAllContainers();
  }

  @Post('containers')
  createContainer(@Body() data: any, @Request() req) {
    return this.tosService.createContainer(data, req.user);
  }

  @Patch('containers/:id/move')
  moveContainer(
    @Param('id') id: string,
    @Body() moveDto: { toYardId: number; toLocation: string },
    @Request() req
  ) {
    return this.tosService.moveContainer(+id, moveDto.toYardId, moveDto.toLocation, req.user);
  }

  @Get('yards')
  findAllYards() {
    return this.tosService.findAllYards();
  }
}
