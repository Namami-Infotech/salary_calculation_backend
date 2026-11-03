import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get(['health', 'api/health'])
  @ApiOperation({ summary: 'Health check endpoint for application status and database connectivity' })
  @ApiResponse({
    status: 200,
    description: 'Application and dependent services are healthy',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2026-11-03T07:30:00.000Z',
        uptime: 120,
        environment: 'development',
        services: {
          database: {
            status: 'up',
            responseTimeMs: 4,
          },
        },
        system: {
          memory: {
            heapUsedMB: 45.2,
            heapTotalMB: 60.1,
            rssMB: 98.4,
          },
          nodeVersion: 'v20.11.0',
          platform: 'win32',
        },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'One or more critical services are unhealthy (e.g. database down)',
  })
  async check(@Res() res: Response) {
    const { isHealthy, report } = await this.healthService.check();
    const statusCode = isHealthy ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
    return res.status(statusCode).json(report);
  }
}

