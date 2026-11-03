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
exports.PayrollRecord = exports.PaymentStatus = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const PayrollBatch_model_1 = require("./PayrollBatch.model");
const Employee_model_1 = require("./Employee.model");
const PayrollLineItem_model_1 = require("./PayrollLineItem.model");
const Payslip_model_1 = require("./Payslip.model");
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PAID"] = "PAID";
    PaymentStatus["FAILED"] = "FAILED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
let PayrollRecord = class PayrollRecord extends sequelize_typescript_1.Model {
};
exports.PayrollRecord = PayrollRecord;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], PayrollRecord.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => PayrollBatch_model_1.PayrollBatch),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }),
    __metadata("design:type", String)
], PayrollRecord.prototype, "batchId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Employee_model_1.Employee),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }),
    __metadata("design:type", String)
], PayrollRecord.prototype, "employeeId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 30 }),
    __metadata("design:type", Number)
], PayrollRecord.prototype, "totalDaysInMonth", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.FLOAT, defaultValue: 30.0 }),
    __metadata("design:type", Number)
], PayrollRecord.prototype, "paidDays", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.FLOAT, defaultValue: 0.0 }),
    __metadata("design:type", Number)
], PayrollRecord.prototype, "unpaidDays", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2), defaultValue: 0.0 }),
    __metadata("design:type", Number)
], PayrollRecord.prototype, "basicSalary", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2), defaultValue: 0.0 }),
    __metadata("design:type", Number)
], PayrollRecord.prototype, "grossEarnings", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2), defaultValue: 0.0 }),
    __metadata("design:type", Number)
], PayrollRecord.prototype, "totalDeductions", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2), defaultValue: 0.0 }),
    __metadata("design:type", Number)
], PayrollRecord.prototype, "netPay", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(PaymentStatus)), defaultValue: PaymentStatus.PENDING }),
    __metadata("design:type", String)
], PayrollRecord.prototype, "paymentStatus", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(64), allowNull: true }),
    __metadata("design:type", String)
], PayrollRecord.prototype, "paymentMethod", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(128), allowNull: true }),
    __metadata("design:type", String)
], PayrollRecord.prototype, "transactionReference", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true }),
    __metadata("design:type", Date)
], PayrollRecord.prototype, "paidAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => PayrollBatch_model_1.PayrollBatch),
    __metadata("design:type", PayrollBatch_model_1.PayrollBatch)
], PayrollRecord.prototype, "batch", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Employee_model_1.Employee),
    __metadata("design:type", Employee_model_1.Employee)
], PayrollRecord.prototype, "employee", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => PayrollLineItem_model_1.PayrollLineItem),
    __metadata("design:type", Array)
], PayrollRecord.prototype, "lineItems", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => Payslip_model_1.Payslip),
    __metadata("design:type", Payslip_model_1.Payslip)
], PayrollRecord.prototype, "payslip", void 0);
exports.PayrollRecord = PayrollRecord = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'payroll_records',
        timestamps: true,
        indexes: [{ unique: true, fields: ['batch_id', 'employee_id'] }],
    })
], PayrollRecord);
//# sourceMappingURL=PayrollRecord.model.js.map