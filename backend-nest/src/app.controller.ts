import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectDataSource() private dataSource: DataSource
  ) {}

  @Get()
  @ApiOperation({ summary: 'Mensaje de bienvenida del Marketplace Logístico' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Estado general del sistema (Liveness)' })
  getHealth() {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
      service: 'Marketplace Logístico TOS',
      version: '1.0.0'
    };
  }

  @Get('health/db')
  @ApiOperation({ summary: 'Verificación de conectividad con la base de datos' })
  async getDbHealth() {
    try {
      const isConnected = this.dataSource.isInitialized;
      // Simple query to ensure connection is responsive
      await this.dataSource.query('SELECT 1');
      
      return {
        status: isConnected ? 'UP' : 'DOWN',
        database: 'MySQL',
        connection: 'ESTABLISHED',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'DOWN',
        database: 'MySQL',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}
