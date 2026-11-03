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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const health_service_1 = require("./health.service");
let HealthController = class HealthController {
    constructor(healthService) {
        this.healthService = healthService;
    }
    async check(res) {
        const { isHealthy, report } = await this.healthService.check();
        const statusCode = isHealthy ? common_1.HttpStatus.OK : common_1.HttpStatus.SERVICE_UNAVAILABLE;
        return res.status(statusCode).json(report);
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(['health', 'api/health']),
    (0, swagger_1.ApiOperation)({ summary: 'Health check endpoint for application status and database connectivity' }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({
        status: 503,
        description: 'One or more critical services are unhealthy (e.g. database down)',
    }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "check", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('Health'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [health_service_1.HealthService])
], HealthController);
//# sourceMappingURL=health.controller.js.map