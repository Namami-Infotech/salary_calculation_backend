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
exports.SalaryComponent = exports.CalculationType = exports.ComponentType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const SalaryStructure_model_1 = require("./SalaryStructure.model");
var ComponentType;
(function (ComponentType) {
    ComponentType["EARNING"] = "EARNING";
    ComponentType["DEDUCTION"] = "DEDUCTION";
})(ComponentType || (exports.ComponentType = ComponentType = {}));
var CalculationType;
(function (CalculationType) {
    CalculationType["FLAT"] = "FLAT";
    CalculationType["PERCENTAGE_OF_BASIC"] = "PERCENTAGE_OF_BASIC";
    CalculationType["FORMULA"] = "FORMULA";
})(CalculationType || (exports.CalculationType = CalculationType = {}));
let SalaryComponent = class SalaryComponent extends sequelize_typescript_1.Model {
};
exports.SalaryComponent = SalaryComponent;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], SalaryComponent.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => SalaryStructure_model_1.SalaryStructure),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }),
    __metadata("design:type", String)
], SalaryComponent.prototype, "structureId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }),
    __metadata("design:type", String)
], SalaryComponent.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ComponentType)), allowNull: false }),
    __metadata("design:type", String)
], SalaryComponent.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(CalculationType)), defaultValue: CalculationType.FLAT }),
    __metadata("design:type", String)
], SalaryComponent.prototype, "calculationType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(12, 2), defaultValue: 0.0 }),
    __metadata("design:type", Number)
], SalaryComponent.prototype, "value", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], SalaryComponent.prototype, "isTaxable", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => SalaryStructure_model_1.SalaryStructure),
    __metadata("design:type", SalaryStructure_model_1.SalaryStructure)
], SalaryComponent.prototype, "structure", void 0);
exports.SalaryComponent = SalaryComponent = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'salary_components', timestamps: true })
], SalaryComponent);
//# sourceMappingURL=SalaryComponent.model.js.map