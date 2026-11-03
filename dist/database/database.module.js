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
exports.DatabaseModule = exports.ALL_MODELS = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const config_1 = require("@nestjs/config");
const Role_model_1 = require("./models/Role.model");
const User_model_1 = require("./models/User.model");
const RefreshToken_model_1 = require("./models/RefreshToken.model");
const Employee_model_1 = require("./models/Employee.model");
const SalaryStructure_model_1 = require("./models/SalaryStructure.model");
const SalaryComponent_model_1 = require("./models/SalaryComponent.model");
const EmployeeSalaryAssignment_model_1 = require("./models/EmployeeSalaryAssignment.model");
const PayrollBatch_model_1 = require("./models/PayrollBatch.model");
const LeaveRequest_model_1 = require("./models/LeaveRequest.model");
const AuditLog_model_1 = require("./models/AuditLog.model");
const database_seeder_service_1 = require("./database-seeder.service");
exports.ALL_MODELS = [
    Role_model_1.Role,
    User_model_1.User,
    RefreshToken_model_1.RefreshToken,
    Employee_model_1.Employee,
    SalaryStructure_model_1.SalaryStructure,
    SalaryComponent_model_1.SalaryComponent,
    EmployeeSalaryAssignment_model_1.EmployeeSalaryAssignment,
    PayrollBatch_model_1.PayrollBatch,
    LeaveRequest_model_1.LeaveRequest,
    AuditLog_model_1.AuditLog,
];
let DatabaseModule = class DatabaseModule {
    constructor(seeder) {
        this.seeder = seeder;
    }
    async onModuleInit() {
        await this.seeder.seedRolesAndAdmin();
    }
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    dialect: 'mysql',
                    host: config.get('DB_HOST', 'localhost'),
                    port: config.get('DB_PORT', 3306),
                    username: config.get('DB_USER', 'root'),
                    password: config.get('DB_PASS', 'rootpassword'),
                    database: config.get('DB_NAME', 'hrms_db'),
                    models: exports.ALL_MODELS,
                    autoLoadModels: true,
                    synchronize: true,
                    sync: {
                        force: false,
                        alter: false,
                    },
                    logging: false,
                    pool: {
                        max: 15,
                        min: 2,
                        acquire: 30000,
                        idle: 10000,
                    },
                    define: {
                        underscored: true,
                        timestamps: true,
                    },
                }),
            }),
            sequelize_1.SequelizeModule.forFeature([Role_model_1.Role, User_model_1.User]),
        ],
        providers: [database_seeder_service_1.DatabaseSeederService],
        exports: [sequelize_1.SequelizeModule, database_seeder_service_1.DatabaseSeederService],
    }),
    __metadata("design:paramtypes", [database_seeder_service_1.DatabaseSeederService])
], DatabaseModule);
//# sourceMappingURL=database.module.js.map