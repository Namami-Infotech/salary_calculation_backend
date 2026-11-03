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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeSalaryAssignment = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Employee_model_1 = require("./Employee.model");
const SalaryStructure_model_1 = require("./SalaryStructure.model");
let EmployeeSalaryAssignment = class EmployeeSalaryAssignment extends sequelize_typescript_1.Model {
};
exports.EmployeeSalaryAssignment = EmployeeSalaryAssignment;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], EmployeeSalaryAssignment.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Employee_model_1.Employee),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }),
    __metadata("design:type", String)
], EmployeeSalaryAssignment.prototype, "employeeId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => SalaryStructure_model_1.SalaryStructure),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }),
    __metadata("design:type", String)
], EmployeeSalaryAssignment.prototype, "structureId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2), allowNull: false }),
    __metadata("design:type", Number)
], EmployeeSalaryAssignment.prototype, "baseSalary", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2), allowNull: false }),
    __metadata("design:type", Number)
], EmployeeSalaryAssignment.prototype, "grossSalary", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2), allowNull: false }),
    __metadata("design:type", Number)
], EmployeeSalaryAssignment.prototype, "netSalary", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATEONLY, allowNull: false }),
    __metadata("design:type", String)
], EmployeeSalaryAssignment.prototype, "effectiveFrom", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATEONLY, allowNull: true }),
    __metadata("design:type", String)
], EmployeeSalaryAssignment.prototype, "effectiveTo", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], EmployeeSalaryAssignment.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Employee_model_1.Employee),
    __metadata("design:type", Employee_model_1.Employee)
], EmployeeSalaryAssignment.prototype, "employee", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => SalaryStructure_model_1.SalaryStructure),
    __metadata("design:type", SalaryStructure_model_1.SalaryStructure)
], EmployeeSalaryAssignment.prototype, "structure", void 0);
exports.EmployeeSalaryAssignment = EmployeeSalaryAssignment = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'employee_salary_assignments', timestamps: true })
], EmployeeSalaryAssignment);
//# sourceMappingURL=EmployeeSalaryAssignment.model.js.map