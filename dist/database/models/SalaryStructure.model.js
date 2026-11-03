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
exports.SalaryStructure = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const SalaryComponent_model_1 = require("./SalaryComponent.model");
const EmployeeSalaryAssignment_model_1 = require("./EmployeeSalaryAssignment.model");
let SalaryStructure = class SalaryStructure extends sequelize_typescript_1.Model {
};
exports.SalaryStructure = SalaryStructure;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], SalaryStructure.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(64), allowNull: true }),
    __metadata("design:type", String)
], SalaryStructure.prototype, "companyId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }),
    __metadata("design:type", String)
], SalaryStructure.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true }),
    __metadata("design:type", String)
], SalaryStructure.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], SalaryStructure.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => SalaryComponent_model_1.SalaryComponent),
    __metadata("design:type", Array)
], SalaryStructure.prototype, "components", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => EmployeeSalaryAssignment_model_1.EmployeeSalaryAssignment),
    __metadata("design:type", Array)
], SalaryStructure.prototype, "assignments", void 0);
exports.SalaryStructure = SalaryStructure = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'salary_structures', timestamps: true })
], SalaryStructure);
//# sourceMappingURL=SalaryStructure.model.js.map