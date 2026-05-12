import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { TransportService } from './transport.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('transport')
@UseGuards(JwtAuthGuard)
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Get('trips')
  findAllTrips() {
    return this.transportService.findAllTrips();
  }

  @Post('trips')
  createTrip(@Body() data: any, @Request() req) {
    return this.transportService.createTrip(data, req.user);
  }

  @Patch('trips/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() data: { status: string },
    @Request() req
  ) {
    return this.transportService.updateTripStatus(+id, data.status, req.user);
  }

  @Get('vehicles')
  findAllVehicles() {
    return this.transportService.findAllVehicles();
  }

  @Get('drivers')
  findAllDrivers() {
    return this.transportService.findAllDrivers();
  }
}
