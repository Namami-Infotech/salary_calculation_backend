"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalaryModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const salary_service_1 = require("./salary.service");
const salary_controller_1 = require("./salary.controller");
const SalaryStructure_model_1 = require("../database/models/SalaryStructure.model");
const SalaryComponent_model_1 = require("../database/models/SalaryComponent.model");
const EmployeeSalaryAssignment_model_1 = require("../database/models/EmployeeSalaryAssignment.model");
const PayrollBatch_model_1 = require("../database/models/PayrollBatch.model");
const Employee_model_1 = require("../database/models/Employee.model");
const LeaveRequest_model_1 = require("../database/models/LeaveRequest.model");
let SalaryModule = class SalaryModule {
};
exports.SalaryModule = SalaryModule;
exports.SalaryModule = SalaryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([
                SalaryStructure_model_1.SalaryStructure,
                SalaryComponent_model_1.SalaryComponent,
                EmployeeSalaryAssignment_model_1.EmployeeSalaryAssignment,
                PayrollBatch_model_1.PayrollBatch,
                Employee_model_1.Employee,
                LeaveRequest_model_1.LeaveRequest,
            ]),
        ],
        controllers: [salary_controller_1.SalaryController],
        providers: [salary_service_1.SalaryService],
        exports: [salary_service_1.SalaryService],
    })
], SalaryModule);
//# sourceMappingURL=salary.module.js.map