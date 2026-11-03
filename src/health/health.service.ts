import { Injectable, Logger } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

export interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  environment: string;
  services: {
    database: {
      status: 'up' | 'down';
      responseTimeMs?: number;
      error?: string;
    };
  };
  system: {
    memory: {
      heapUsedMB: number;
      heapTotalMB: number;
      rssMB: number;
    };
    nodeVersion: string;
    platform: string;
  };
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly sequelize: Sequelize) {}

  async check(): Promise<{ isHealthy: boolean; report: HealthStatus }> {
    let dbStatus: 'up' | 'down' = 'up';
    let dbError: string | undefined;
    let responseTimeMs = 0;

    const start = Date.now();
    try {
      await this.sequelize.authenticate();
      responseTimeMs = Date.now() - start;
    } catch (error: any) {
      dbStatus = 'down';
      dbError = error?.message || 'Database connection error';
      this.logger.error(`Database health check failed: ${dbError}`);
    }

    const mem = process.memoryUsage();
    const isHealthy = dbStatus === 'up';

    const report: HealthStatus = {
      status: isHealthy ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: {
          status: dbStatus,
          ...(dbStatus === 'up' ? { responseTimeMs } : { error: dbError }),
        },
      },
      system: {
        memory: {
          heapUsedMB: Math.round((mem.heapUsed / 1024 / 1024) * 100) / 100,
          heapTotalMB: Math.round((mem.heapTotal / 1024 / 1024) * 100) / 100,
          rssMB: Math.round((mem.rss / 1024 / 1024) * 100) / 100,
        },
        nodeVersion: process.version,
        platform: process.platform,
      },
    };

    return { isHealthy, report };
  }
}

