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
exports.SalaryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const salary_service_1 = require("./salary.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const Role_model_1 = require("../database/models/Role.model");
let SalaryController = class SalaryController {
    constructor(salaryService) {
        this.salaryService = salaryService;
    }
    async getStructures(user) {
        return this.salaryService.getStructures(user.companyId);
    }
    async getBatches(user) {
        return this.salaryService.getBatches(user.companyId);
    }
    async createPayrollBatch(user, year, month) {
        return this.salaryService.createPayrollBatch(user.companyId, year, month, user.userId);
    }
    async getBatchById(user, id) {
        return this.salaryService.getBatchById(user.companyId, id);
    }
    async deleteBatch(user, id) {
        return this.salaryService.deleteBatch(user.companyId, id);
    }
    async approveBatch(user, id) {
        return this.salaryService.approveBatch(user.companyId, id, user.userId);
    }
    async markBatchAsPaid(user, id) {
        return this.salaryService.markBatchAsPaid(user.companyId, id, user.userId);
    }
};
exports.SalaryController = SalaryController;
__decorate([
    (0, common_1.Get)('structures'),
    (0, swagger_1.ApiOperation)({ summary: 'Get configured salary structures' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "getStructures", null);
__decorate([
    (0, common_1.Get)('batches'),
    (0, swagger_1.ApiOperation)({ summary: 'List all monthly payroll batches' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "getBatches", null);
__decorate([
    (0, common_1.Post)('batches'),
    (0, roles_decorator_1.Roles)(Role_model_1.RoleType.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate and generate monthly payroll batch in transaction (Admin only)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)('year')),
    __param(2, (0, common_1.Body)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "createPayrollBatch", null);
__decorate([
    (0, common_1.Get)('batches/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get single payroll batch with full details' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "getBatchById", null);
__decorate([
    (0, common_1.Delete)('batches/:id'),
    (0, roles_decorator_1.Roles)(Role_model_1.RoleType.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a payroll batch (Admin only)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "deleteBatch", null);
__decorate([
    (0, common_1.Post)('batches/:id/approve'),
    (0, roles_decorator_1.Roles)(Role_model_1.RoleType.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Approve payroll batch (Admin only)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "approveBatch", null);
__decorate([
    (0, common_1.Post)('batches/:id/pay'),
    (0, roles_decorator_1.Roles)(Role_model_1.RoleType.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Mark payroll batch as paid (Admin only)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "markBatchAsPaid", null);
exports.SalaryController = SalaryController = __decorate([
    (0, swagger_1.ApiTags)('Salary & Payroll'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('salary'),
    __metadata("design:paramtypes", [salary_service_1.SalaryService])
], SalaryController);
//# sourceMappingURL=salary.controller.js.map