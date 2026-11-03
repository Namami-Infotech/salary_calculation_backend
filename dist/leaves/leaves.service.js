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
exports.LeavesService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const LeaveRequest_model_1 = require("../database/models/LeaveRequest.model");
const Employee_model_1 = require("../database/models/Employee.model");
let LeavesService = class LeavesService {
    constructor(leaveRequestModel, employeeModel) {
        this.leaveRequestModel = leaveRequestModel;
        this.employeeModel = employeeModel;
    }
    async getLeaveTypes() {
        return [
            { id: 'casual', name: 'Casual Leave (CL)', code: 'CL' },
            { id: 'sick', name: 'Sick Leave (SL)', code: 'SL' },
            { id: 'earned', name: 'Earned Leave (EL)', code: 'EL' },
            { id: 'maternity', name: 'Maternity / Paternity Leave', code: 'ML' },
            { id: 'unpaid', name: 'Leave Without Pay (LWP)', code: 'LWP' },
        ];
    }
    async findAllRequests(companyId) {
        const employeeWhere = {};
        if (companyId) {
            employeeWhere[sequelize_2.Op.or] = [{ companyId }, { companyId: null }];
        }
        return this.leaveRequestModel.findAll({
            include: [
                {
                    model: Employee_model_1.Employee,
                    as: 'employee',
                    where: Object.keys(employeeWhere).length ? employeeWhere : undefined,
                    required: false,
                    attributes: ['id', 'firstName', 'lastName', 'employeeCode', 'email', 'department'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });
    }
    async applyLeave(companyId, employeeIdOrUserId, dto) {
        const targetId = dto.employeeId || employeeIdOrUserId;
        if (!targetId) {
            throw new common_1.BadRequestException('Please provide a valid employee ID.');
        }
        let employee = await this.employeeModel.findByPk(targetId);
        if (!employee) {
            employee = await this.employeeModel.findOne({ where: { userId: targetId } });
        }
        if (!employee) {
            throw new common_1.NotFoundException(`Employee not found with ID "${targetId}". Please select a registered active employee.`);
        }
        const employeeId = employee.id;
        const startDate = dto.startDate;
        const endDate = dto.endDate || dto.startDate;
        if (new Date(startDate) > new Date(endDate)) {
            throw new common_1.BadRequestException('Start date cannot be after end date.');
        }
        const overlapping = await this.leaveRequestModel.findOne({
            where: {
                employeeId,
                status: { [sequelize_2.Op.in]: [LeaveRequest_model_1.LeaveRequestStatus.PENDING, LeaveRequest_model_1.LeaveRequestStatus.APPROVED] },
                startDate: { [sequelize_2.Op.lte]: endDate },
                endDate: { [sequelize_2.Op.gte]: startDate },
            },
        });
        if (overlapping) {
            throw new common_1.ConflictException('You already have a pending or approved leave request during these dates.');
        }
        const request = await this.leaveRequestModel.create({
            employeeId,
            leaveType: dto.leaveType || 'Casual Leave (CL)',
            startDate,
            endDate,
            totalDays: Number(dto.totalDays) > 0 ? Number(dto.totalDays) : 1,
            isHalfDay: Boolean(dto.isHalfDay),
            reason: dto.reason,
            status: LeaveRequest_model_1.LeaveRequestStatus.PENDING,
        });
        return this.leaveRequestModel.findByPk(request.id, {
            include: [
                {
                    model: Employee_model_1.Employee,
                    as: 'employee',
                    attributes: ['id', 'firstName', 'lastName', 'employeeCode', 'email', 'department'],
                },
            ],
        });
    }
    async approveLeave(companyId, requestId, actionedById, comments) {
        const request = await this.leaveRequestModel.findByPk(requestId);
        if (!request || request.status !== LeaveRequest_model_1.LeaveRequestStatus.PENDING) {
            throw new common_1.NotFoundException('Leave request not found or not in pending status.');
        }
        let resolvedActionedBy = null;
        if (actionedById) {
            const emp = await this.employeeModel.findByPk(actionedById);
            if (emp) {
                resolvedActionedBy = emp.id;
            }
            else {
                const empByUser = await this.employeeModel.findOne({ where: { userId: actionedById } });
                if (empByUser) {
                    resolvedActionedBy = empByUser.id;
                }
            }
        }
        await request.update({
            status: LeaveRequest_model_1.LeaveRequestStatus.APPROVED,
            actionedBy: resolvedActionedBy,
            actionComments: comments || 'Approved by Admin',
            actionedAt: new Date(),
        });
        return this.leaveRequestModel.findByPk(request.id, {
            include: [
                {
                    model: Employee_model_1.Employee,
                    as: 'employee',
                    attributes: ['id', 'firstName', 'lastName', 'employeeCode', 'email', 'department'],
                },
            ],
        });
    }
    async rejectLeave(companyId, requestId, actionedById, comments) {
        const request = await this.leaveRequestModel.findByPk(requestId);
        if (!request || request.status !== LeaveRequest_model_1.LeaveRequestStatus.PENDING) {
            throw new common_1.NotFoundException('Leave request not found or not in pending status.');
        }
        let resolvedActionedBy = null;
        if (actionedById) {
            const emp = await this.employeeModel.findByPk(actionedById);
            if (emp) {
                resolvedActionedBy = emp.id;
            }
            else {
                const empByUser = await this.employeeModel.findOne({ where: { userId: actionedById } });
                if (empByUser) {
                    resolvedActionedBy = empByUser.id;
                }
            }
        }
        await request.update({
            status: LeaveRequest_model_1.LeaveRequestStatus.REJECTED,
            actionedBy: resolvedActionedBy,
            actionComments: comments || 'Rejected by Admin',
            actionedAt: new Date(),
        });
        return this.leaveRequestModel.findByPk(request.id, {
            include: [
                {
                    model: Employee_model_1.Employee,
                    as: 'employee',
                    attributes: ['id', 'firstName', 'lastName', 'employeeCode', 'email', 'department'],
                },
            ],
        });
    }
};
exports.LeavesService = LeavesService;
exports.LeavesService = LeavesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(LeaveRequest_model_1.LeaveRequest)),
    __param(1, (0, sequelize_1.InjectModel)(Employee_model_1.Employee)),
    __metadata("design:paramtypes", [Object, Object])
], LeavesService);
//# sourceMappingURL=leaves.service.js.map