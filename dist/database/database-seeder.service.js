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
exports.DatabaseSeederService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const bcrypt = require("bcrypt");
const Role_model_1 = require("./models/Role.model");
const User_model_1 = require("./models/User.model");
let DatabaseSeederService = class DatabaseSeederService {
    constructor(roleModel, userModel, sequelize) {
        this.roleModel = roleModel;
        this.userModel = userModel;
        this.sequelize = sequelize;
        this.logger = new common_1.Logger('DatabaseSeeder');
    }
    async onModuleInit() {
        await this.ensureSchemaUpdates();
        await this.seedRolesAndAdmin();
        await this.cleanConstraints();
    }
    async ensureSchemaUpdates() {
        try {
            await this.sequelize.query(`ALTER TABLE payroll_batches ADD COLUMN records JSON NULL;`);
            this.logger.log('✅ Added "records" JSON column to payroll_batches table.');
        }
        catch (err) {
        }
    }
    async cleanConstraints() {
        try {
            await this.sequelize.query(`ALTER TABLE leave_requests DROP FOREIGN KEY leave_requests_ibfk_2;`);
        }
        catch (e) { }
        try {
            await this.sequelize.query(`ALTER TABLE leave_requests DROP FOREIGN KEY leave_requests_ibfk_3;`);
        }
        catch (e) { }
    }
    async seedRolesAndAdmin() {
        try {
            this.logger.log('Checking database roles and default admin user...');
            const adminRoleId = '11111111-1111-1111-1111-111111111111';
            let adminRole = await this.roleModel.findByPk(adminRoleId);
            if (!adminRole) {
                adminRole = await this.roleModel.findOne({ where: { name: Role_model_1.RoleType.ADMIN } });
            }
            if (!adminRole) {
                adminRole = await this.roleModel.create({
                    id: adminRoleId,
                    name: Role_model_1.RoleType.ADMIN,
                    description: 'Complete administrative, HR, payroll, and management access',
                });
                this.logger.log('✅ ADMIN role created successfully.');
            }
            const employeeRoleId = '22222222-2222-2222-2222-222222222222';
            let employeeRole = await this.roleModel.findByPk(employeeRoleId);
            if (!employeeRole) {
                employeeRole = await this.roleModel.findOne({ where: { name: Role_model_1.RoleType.EMPLOYEE } });
            }
            if (!employeeRole) {
                await this.roleModel.create({
                    id: employeeRoleId,
                    name: Role_model_1.RoleType.EMPLOYEE,
                    description: 'Self-service portal access',
                });
                this.logger.log('✅ EMPLOYEE role created successfully.');
            }
            const email = 'admin@hrms.com';
            const plainPassword = '123456';
            const adminUserId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
            const companyId = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
            let adminUser = await this.userModel.findOne({ where: { email } });
            if (!adminUser) {
                const passwordHash = await bcrypt.hash(plainPassword, 12);
                await this.userModel.create({
                    id: adminUserId,
                    companyId,
                    email,
                    passwordHash,
                    roleId: adminRole.id,
                    isActive: true,
                });
                this.logger.log(`✅ Default Admin User auto-created: ${email} (Password: ${plainPassword})`);
            }
            else {
                if (!adminUser.isActive || adminUser.roleId !== adminRole.id) {
                    await adminUser.update({
                        isActive: true,
                        roleId: adminRole.id,
                    });
                    this.logger.log(`✅ Admin user verified & updated: ${email}`);
                }
                else {
                    this.logger.log(`ℹ️ Default Admin User already exists & active: ${email}`);
                }
            }
        }
        catch (err) {
            this.logger.error('Failed to auto-seed database:', err);
        }
    }
};
exports.DatabaseSeederService = DatabaseSeederService;
exports.DatabaseSeederService = DatabaseSeederService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(Role_model_1.Role)),
    __param(1, (0, sequelize_1.InjectModel)(User_model_1.User)),
    __metadata("design:paramtypes", [Object, Object, sequelize_typescript_1.Sequelize])
], DatabaseSeederService);
//# sourceMappingURL=database-seeder.service.js.map