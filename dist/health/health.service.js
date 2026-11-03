"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var HealthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_typescript_1 = require("sequelize-typescript");
let HealthService = HealthService_1 = class HealthService {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.logger = new common_1.Logger(HealthService_1.name);
    }
    async check() {
        let dbStatus = 'up';
        let dbError;
        let responseTimeMs = 0;
        const start = Date.now();
        try {
            await this.sequelize.authenticate();
            responseTimeMs = Date.now() - start;
        }
        catch (error) {
            dbStatus = 'down';
            dbError = error?.message || 'Database connection error';
            this.logger.error(`Database health check failed: ${dbError}`);
        }
        const mem = process.memoryUsage();
        const isHealthy = dbStatus === 'up';
        const report = {
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
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = HealthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize])
], HealthService);
//# sourceMappingURL=health.service.js.map