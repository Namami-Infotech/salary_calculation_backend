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
export declare class HealthService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    check(): Promise<{
        isHealthy: boolean;
        report: HealthStatus;
    }>;
}
