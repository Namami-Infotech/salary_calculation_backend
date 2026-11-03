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
exports.PayrollBatch = exports.PayrollBatchStatus = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
var PayrollBatchStatus;
(function (PayrollBatchStatus) {
    PayrollBatchStatus["DRAFT"] = "DRAFT";
    PayrollBatchStatus["PREVIEW"] = "PREVIEW";
    PayrollBatchStatus["APPROVED"] = "APPROVED";
    PayrollBatchStatus["PROCESSED"] = "PROCESSED";
    PayrollBatchStatus["PAID"] = "PAID";
})(PayrollBatchStatus || (exports.PayrollBatchStatus = PayrollBatchStatus = {}));
let PayrollBatch = class PayrollBatch extends sequelize_typescript_1.Model {
};
exports.PayrollBatch = PayrollBatch;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], PayrollBatch.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(64), allowNull: true }),
    __metadata("design:type", String)
], PayrollBatch.prototype, "companyId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], PayrollBatch.prototype, "year", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], PayrollBatch.prototype, "month", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(14, 2), defaultValue: 0.0 }),
    __metadata("design:type", Number)
], PayrollBatch.prototype, "totalGrossPay", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(14, 2), defaultValue: 0.0 }),
    __metadata("design:type", Number)
], PayrollBatch.prototype, "totalDeductions", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(14, 2), defaultValue: 0.0 }),
    __metadata("design:type", Number)
], PayrollBatch.prototype, "totalNetPay", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(PayrollBatchStatus)), defaultValue: PayrollBatchStatus.DRAFT }),
    __metadata("design:type", String)
], PayrollBatch.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true }),
    __metadata("design:type", String)
], PayrollBatch.prototype, "approvedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true }),
    __metadata("design:type", Date)
], PayrollBatch.prototype, "approvedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true }),
    __metadata("design:type", String)
], PayrollBatch.prototype, "processedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true }),
    __metadata("design:type", Date)
], PayrollBatch.prototype, "processedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true }),
    __metadata("design:type", String)
], PayrollBatch.prototype, "notes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON, allowNull: true }),
    __metadata("design:type", Array)
], PayrollBatch.prototype, "records", void 0);
exports.PayrollBatch = PayrollBatch = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'payroll_batches',
        timestamps: true,
        indexes: [{ unique: true, fields: ['company_id', 'year', 'month'] }],
    })
], PayrollBatch);
//# sourceMappingURL=PayrollBatch.model.js.map