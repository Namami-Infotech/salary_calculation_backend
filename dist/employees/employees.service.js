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
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_2 = require("sequelize");
const Employee_model_1 = require("../database/models/Employee.model");
let EmployeesService = class EmployeesService {
    constructor(employeeModel, sequelize) {
        this.employeeModel = employeeModel;
        this.sequelize = sequelize;
    }
    async findAll(companyId, paginationDto) {
        const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC', status } = paginationDto;
        const offset = (page - 1) * limit;
        const where = companyId ? { [sequelize_2.Op.or]: [{ companyId }, { companyId: null }] } : {};
        if (search) {
            const searchCondition = [
                { firstName: { [sequelize_2.Op.like]: `%${search}%` } },
                { lastName: { [sequelize_2.Op.like]: `%${search}%` } },
                { employeeCode: { [sequelize_2.Op.like]: `%${search}%` } },
                { email: { [sequelize_2.Op.like]: `%${search}%` } },
            ];
            if (where[sequelize_2.Op.or]) {
                where[sequelize_2.Op.and] = [
                    { [sequelize_2.Op.or]: where[sequelize_2.Op.or] },
                    { [sequelize_2.Op.or]: searchCondition },
                ];
                delete where[sequelize_2.Op.or];
            }
            else {
                where[sequelize_2.Op.or] = searchCondition;
            }
        }
        const statusParam = (status || paginationDto?.status)?.toString().toUpperCase();
        if (statusParam && statusParam !== 'ALL') {
            if (statusParam === 'ACTIVE') {
                where.employmentStatus = {
                    [sequelize_2.Op.in]: ['ACTIVE', 'PROBATION', 'CONFIRMED'],
                };
            }
            else {
                where.employmentStatus = statusParam;
            }
        }
        const { count, rows } = await this.employeeModel.findAndCountAll({
            where,
            limit,
            offset,
            order: [[sortBy, sortOrder]],
        });
        const normalizedData = rows.map((emp) => {
            const data = typeof emp.toJSON === 'function' ? emp.toJSON() : emp;
            if (data.employmentStatus !== 'INACTIVE') {
                data.employmentStatus = 'ACTIVE';
            }
            return data;
        });
        return {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
            data: normalizedData,
        };
    }
    async getNextCode(companyId) {
        const where = companyId ? { companyId } : {};
        const employees = await this.employeeModel.findAll({
            where,
            attributes: ['employeeCode'],
        });
        const numbers = employees
            .map((emp) => {
            const match = (emp.employeeCode || '').match(/\d+/);
            return match ? parseInt(match[0], 10) : 0;
        })
            .filter((n) => !isNaN(n));
        const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0;
        const nextCode = `EMP${String(maxNum + 1).padStart(3, '0')}`;
        return { nextCode };
    }
    async findOne(companyId, id) {
        const where = { id };
        if (companyId) {
            where.companyId = companyId;
        }
        let employee = await this.employeeModel.findOne({
            where,
        });
        if (!employee && companyId) {
            employee = await this.employeeModel.findOne({ where: { id } });
        }
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with ID ${id} not found.`);
        }
        const data = typeof employee.toJSON === 'function' ? employee.toJSON() : employee;
        if (data.employmentStatus !== 'INACTIVE') {
            data.employmentStatus = 'ACTIVE';
        }
        return data;
    }
    async create(companyId, createDto) {
        const whereCheck = {
            [sequelize_2.Op.or]: [{ employeeCode: createDto.employeeCode }, { email: createDto.email }],
        };
        if (companyId) {
            whereCheck.companyId = companyId;
        }
        const existing = await this.employeeModel.findOne({
            where: whereCheck,
        });
        if (existing) {
            throw new common_1.ConflictException('Employee with this code or email already exists.');
        }
        return this.employeeModel.create({
            ...createDto,
            employmentStatus: createDto.employmentStatus || Employee_model_1.EmploymentStatus.ACTIVE,
            companyId,
        });
    }
    async update(companyId, id, updateDto) {
        const employee = await this.findOne(companyId, id);
        if (updateDto.employeeCode || updateDto.email) {
            const collisions = await this.employeeModel.findOne({
                where: {
                    id: { [sequelize_2.Op.ne]: id },
                    [sequelize_2.Op.or]: [
                        ...(updateDto.employeeCode ? [{ employeeCode: updateDto.employeeCode }] : []),
                        ...(updateDto.email ? [{ email: updateDto.email }] : []),
                    ],
                },
            });
            if (collisions) {
                throw new common_1.ConflictException('Another employee with this code or email already exists.');
            }
        }
        await employee.update(updateDto);
        return this.findOne(companyId, id);
    }
    async remove(companyId, id) {
        const employee = await this.findOne(companyId, id);
        await employee.destroy();
        return { success: true, message: `Employee ${employee.employeeCode} soft-deleted successfully.` };
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(Employee_model_1.Employee)),
    __metadata("design:paramtypes", [Object, sequelize_typescript_1.Sequelize])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map