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
exports.Payslip = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const PayrollRecord_model_1 = require("./PayrollRecord.model");
let Payslip = class Payslip extends sequelize_typescript_1.Model {
};
exports.Payslip = Payslip;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Payslip.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => PayrollRecord_model_1.PayrollRecord),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, unique: true, allowNull: false }),
    __metadata("design:type", String)
], Payslip.prototype, "payrollRecordId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(64), unique: true, allowNull: false }),
    __metadata("design:type", String)
], Payslip.prototype, "payslipNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500), allowNull: true }),
    __metadata("design:type", String)
], Payslip.prototype, "pdfUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, defaultValue: sequelize_typescript_1.DataType.NOW }),
    __metadata("design:type", Date)
], Payslip.prototype, "generatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => PayrollRecord_model_1.PayrollRecord),
    __metadata("design:type", PayrollRecord_model_1.PayrollRecord)
], Payslip.prototype, "payrollRecord", void 0);
exports.Payslip = Payslip = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'payslips', timestamps: true })
], Payslip);
//# sourceMappingURL=Payslip.model.js.map