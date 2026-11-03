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
exports.PayrollLineItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const PayrollRecord_model_1 = require("./PayrollRecord.model");
const SalaryComponent_model_1 = require("./SalaryComponent.model");
let PayrollLineItem = class PayrollLineItem extends sequelize_typescript_1.Model {
};
exports.PayrollLineItem = PayrollLineItem;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], PayrollLineItem.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => PayrollRecord_model_1.PayrollRecord),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }),
    __metadata("design:type", String)
], PayrollLineItem.prototype, "payrollRecordId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }),
    __metadata("design:type", String)
], PayrollLineItem.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(SalaryComponent_model_1.ComponentType)), allowNull: false }),
    __metadata("design:type", String)
], PayrollLineItem.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2), allowNull: false }),
    __metadata("design:type", Number)
], PayrollLineItem.prototype, "amount", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => PayrollRecord_model_1.PayrollRecord),
    __metadata("design:type", PayrollRecord_model_1.PayrollRecord)
], PayrollLineItem.prototype, "payrollRecord", void 0);
exports.PayrollLineItem = PayrollLineItem = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'payroll_line_items', timestamps: true })
], PayrollLineItem);
//# sourceMappingURL=PayrollLineItem.model.js.map