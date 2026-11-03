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
exports.SalaryService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_2 = require("sequelize");
const crypto_1 = require("crypto");
const SalaryStructure_model_1 = require("../database/models/SalaryStructure.model");
const SalaryComponent_model_1 = require("../database/models/SalaryComponent.model");
const EmployeeSalaryAssignment_model_1 = require("../database/models/EmployeeSalaryAssignment.model");
const PayrollBatch_model_1 = require("../database/models/PayrollBatch.model");
const Employee_model_1 = require("../database/models/Employee.model");
const LeaveRequest_model_1 = require("../database/models/LeaveRequest.model");
let SalaryService = class SalaryService {
    constructor(structureModel, componentModel, assignmentModel, batchModel, employeeModel, leaveRequestModel, sequelize) {
        this.structureModel = structureModel;
        this.componentModel = componentModel;
        this.assignmentModel = assignmentModel;
        this.batchModel = batchModel;
        this.employeeModel = employeeModel;
        this.leaveRequestModel = leaveRequestModel;
        this.sequelize = sequelize;
    }
    async onModuleInit() {
        await this.ensureRecordsColumn();
    }
    async ensureRecordsColumn() {
        try {
            await this.sequelize.query(`ALTER TABLE payroll_batches ADD COLUMN records JSON NULL;`);
        }
        catch (e) {
        }
    }
    async getStructures(companyId) {
        const where = {};
        if (companyId) {
            where[sequelize_2.Op.or] = [{ companyId }, { companyId: null }];
        }
        return this.structureModel.findAll({
            where: Object.keys(where).length ? where : undefined,
            include: [{ model: SalaryComponent_model_1.SalaryComponent }],
        });
    }
    async getBatches(companyId) {
        const where = {};
        if (companyId) {
            where[sequelize_2.Op.or] = [{ companyId }, { companyId: null }];
        }
        return this.batchModel.findAll({
            where: Object.keys(where).length ? where : undefined,
            order: [['year', 'DESC'], ['month', 'DESC']],
        });
    }
    async getBatchById(companyId, id) {
        const where = { id };
        if (companyId) {
            where[sequelize_2.Op.or] = [{ companyId }, { companyId: null }];
        }
        const batch = await this.batchModel.findOne({ where });
        if (!batch) {
            throw new common_1.NotFoundException(`Payroll batch with ID "${id}" not found.`);
        }
        return batch;
    }
    async createPayrollBatch(companyId, year, month, userId) {
        if (!year || !month || month < 1 || month > 12) {
            throw new common_1.BadRequestException('Please provide a valid year and month (1-12).');
        }
        await this.ensureRecordsColumn();
        const existing = await this.batchModel.findOne({
            where: {
                ...(companyId ? { [sequelize_2.Op.or]: [{ companyId }, { companyId: null }] } : {}),
                year,
                month,
            },
        });
        if (existing) {
            if (existing.status === PayrollBatch_model_1.PayrollBatchStatus.PREVIEW) {
                await this.deleteBatch(companyId, existing.id);
            }
            else {
                throw new common_1.ConflictException(`Payroll batch for ${year}-${String(month).padStart(2, '0')} already exists (${existing.status}).`);
            }
        }
        const totalDaysInMonth = new Date(year, month, 0).getDate();
        const monthStartStr = `${year}-${String(month).padStart(2, '0')}-01`;
        const monthEndStr = `${year}-${String(month).padStart(2, '0')}-${String(totalDaysInMonth).padStart(2, '0')}`;
        const monthStartDate = new Date(`${monthStartStr}T00:00:00Z`);
        const monthEndDate = new Date(`${monthEndStr}T23:59:59Z`);
        const empWhere = { employmentStatus: Employee_model_1.EmploymentStatus.ACTIVE };
        if (companyId) {
            empWhere[sequelize_2.Op.or] = [{ companyId }, { companyId: null }];
        }
        const employees = await this.employeeModel.findAll({
            where: empWhere,
            include: [
                {
                    model: EmployeeSalaryAssignment_model_1.EmployeeSalaryAssignment,
                    as: 'salaryAssignments',
                    where: { isActive: true },
                    required: false,
                },
                {
                    model: LeaveRequest_model_1.LeaveRequest,
                    as: 'leaveRequests',
                    required: false,
                    where: {
                        status: { [sequelize_2.Op.in]: [LeaveRequest_model_1.LeaveRequestStatus.APPROVED, LeaveRequest_model_1.LeaveRequestStatus.PENDING] },
                        startDate: { [sequelize_2.Op.lte]: monthEndStr },
                        endDate: { [sequelize_2.Op.gte]: monthStartStr },
                    },
                },
            ],
        });
        if (employees.length === 0) {
            throw new common_1.BadRequestException('No active employees found to generate payroll.');
        }
        const batchId = await this.sequelize.transaction(async (t) => {
            let batchGross = 0;
            let batchDeductions = 0;
            let batchNet = 0;
            const records = [];
            for (const emp of employees) {
                const assignment = emp.salaryAssignments?.[0];
                const monthlySalary = Number(emp.monthlySalary) > 0
                    ? Number(emp.monthlySalary)
                    : (assignment ? Number(assignment.grossSalary) : 45000);
                const perDaySalary = monthlySalary / totalDaysInMonth;
                let totalLeaveDays = 0;
                const leaveBreakdown = [];
                if (Array.isArray(emp.leaveRequests)) {
                    for (const leave of emp.leaveRequests) {
                        let days = Number(leave.totalDays);
                        if (!days || isNaN(days) || days <= 0) {
                            const leaveStart = new Date(leave.startDate) < monthStartDate ? monthStartDate : new Date(leave.startDate);
                            const leaveEnd = new Date(leave.endDate) > monthEndDate ? monthEndDate : new Date(leave.endDate);
                            days = Math.max(1, Math.ceil((leaveEnd.getTime() - leaveStart.getTime()) / (1000 * 60 * 60 * 24)) + 1);
                            if (leave.isHalfDay)
                                days = 0.5;
                        }
                        const leaveDedAmount = Math.round(days * perDaySalary * 100) / 100;
                        totalLeaveDays += days;
                        leaveBreakdown.push({
                            type: leave.leaveType || 'Leave',
                            days,
                            amount: leaveDedAmount,
                        });
                    }
                }
                totalLeaveDays = Math.min(totalDaysInMonth, totalLeaveDays);
                const paidDays = Math.max(0, totalDaysInMonth - totalLeaveDays);
                const leaveDeduction = Math.round(totalLeaveDays * perDaySalary * 100) / 100;
                const basic = Math.round(monthlySalary * 0.50 * 100) / 100;
                const hra = Math.round(monthlySalary * 0.30 * 100) / 100;
                const specialAllowance = Math.round((monthlySalary - basic - hra) * 100) / 100;
                const totalDed = leaveDeduction;
                const net = Math.max(0, Math.round((monthlySalary - totalDed) * 100) / 100);
                batchGross += monthlySalary;
                batchDeductions += totalDed;
                batchNet += net;
                const lineItems = [
                    { name: 'Basic Salary', type: SalaryComponent_model_1.ComponentType.EARNING, amount: basic },
                    { name: 'House Rent Allowance (A)', type: SalaryComponent_model_1.ComponentType.EARNING, amount: hra },
                    { name: 'Special Allowance', type: SalaryComponent_model_1.ComponentType.EARNING, amount: specialAllowance },
                ];
                if (leaveDeduction > 0) {
                    if (leaveBreakdown.length > 0) {
                        for (const item of leaveBreakdown) {
                            lineItems.push({
                                name: `Leave Deduction (${item.days} Day${item.days > 1 ? 's' : ''} - ${item.type})`,
                                type: SalaryComponent_model_1.ComponentType.DEDUCTION,
                                amount: item.amount,
                            });
                        }
                    }
                    else {
                        lineItems.push({
                            name: `Leave Deduction (${totalLeaveDays} Day${totalLeaveDays > 1 ? 's' : ''})`,
                            type: SalaryComponent_model_1.ComponentType.DEDUCTION,
                            amount: leaveDeduction,
                        });
                    }
                }
                const payslipNumber = `PAY-${year}${String(month).padStart(2, '0')}-${emp.employeeCode}`;
                records.push({
                    id: (0, crypto_1.randomUUID)(),
                    employeeId: emp.id,
                    employee: {
                        id: emp.id,
                        firstName: emp.firstName,
                        lastName: emp.lastName,
                        employeeCode: emp.employeeCode,
                        department: emp.department,
                        designation: emp.designation,
                        monthlySalary,
                    },
                    totalDaysInMonth,
                    paidDays,
                    unpaidDays: totalLeaveDays,
                    basicSalary: basic,
                    grossEarnings: monthlySalary,
                    totalDeductions: totalDed,
                    netPay: net,
                    paymentStatus: 'PENDING',
                    lineItems,
                    payslip: {
                        payslipNumber,
                        generatedAt: new Date(),
                    },
                });
            }
            const batch = await this.batchModel.create({
                companyId,
                year,
                month,
                totalGrossPay: batchGross,
                totalDeductions: batchDeductions,
                totalNetPay: batchNet,
                status: PayrollBatch_model_1.PayrollBatchStatus.PREVIEW,
                processedBy: userId,
                processedAt: new Date(),
                records,
            }, { transaction: t });
            return batch.id;
        });
        return this.getBatchById(companyId, batchId);
    }
    async approveBatch(companyId, batchId, userId) {
        const where = { id: batchId };
        if (companyId) {
            where[sequelize_2.Op.or] = [{ companyId }, { companyId: null }];
        }
        const batch = await this.batchModel.findOne({ where });
        if (!batch)
            throw new common_1.NotFoundException('Payroll batch not found.');
        await batch.update({
            status: PayrollBatch_model_1.PayrollBatchStatus.APPROVED,
            approvedBy: userId,
            approvedAt: new Date(),
        });
        return this.getBatchById(companyId, batchId);
    }
    async markBatchAsPaid(companyId, batchId, userId) {
        const where = { id: batchId };
        if (companyId) {
            where[sequelize_2.Op.or] = [{ companyId }, { companyId: null }];
        }
        const batch = await this.batchModel.findOne({ where });
        if (!batch)
            throw new common_1.NotFoundException('Payroll batch not found.');
        const updatedRecords = Array.isArray(batch.records)
            ? batch.records.map((rec) => ({
                ...rec,
                paymentStatus: 'PAID',
                paidAt: new Date(),
            }))
            : batch.records;
        await batch.update({
            status: PayrollBatch_model_1.PayrollBatchStatus.PAID,
            processedBy: userId,
            processedAt: new Date(),
            records: updatedRecords,
        });
        return this.getBatchById(companyId, batchId);
    }
    async deleteBatch(companyId, batchId) {
        const where = { id: batchId };
        if (companyId) {
            where[sequelize_2.Op.or] = [{ companyId }, { companyId: null }];
        }
        const batch = await this.batchModel.findOne({ where });
        if (!batch)
            throw new common_1.NotFoundException('Payroll batch not found.');
        if (batch.status === PayrollBatch_model_1.PayrollBatchStatus.PAID) {
            throw new common_1.BadRequestException('Cannot delete a payroll batch that is already marked as PAID.');
        }
        await batch.destroy();
        return { success: true, message: 'Payroll batch deleted successfully.' };
    }
};
exports.SalaryService = SalaryService;
exports.SalaryService = SalaryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(SalaryStructure_model_1.SalaryStructure)),
    __param(1, (0, sequelize_1.InjectModel)(SalaryComponent_model_1.SalaryComponent)),
    __param(2, (0, sequelize_1.InjectModel)(EmployeeSalaryAssignment_model_1.EmployeeSalaryAssignment)),
    __param(3, (0, sequelize_1.InjectModel)(PayrollBatch_model_1.PayrollBatch)),
    __param(4, (0, sequelize_1.InjectModel)(Employee_model_1.Employee)),
    __param(5, (0, sequelize_1.InjectModel)(LeaveRequest_model_1.LeaveRequest)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, sequelize_typescript_1.Sequelize])
], SalaryService);
//# sourceMappingURL=salary.service.js.map