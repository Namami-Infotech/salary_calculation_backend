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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const sequelize_1 = require("@nestjs/sequelize");
const bcrypt = require("bcrypt");
const User_model_1 = require("../database/models/User.model");
const Role_model_1 = require("../database/models/Role.model");
const RefreshToken_model_1 = require("../database/models/RefreshToken.model");
const Employee_model_1 = require("../database/models/Employee.model");
let AuthService = AuthService_1 = class AuthService {
    constructor(userModel, roleModel, refreshTokenModel, jwtService, configService) {
        this.userModel = userModel;
        this.roleModel = roleModel;
        this.refreshTokenModel = refreshTokenModel;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async onModuleInit() {
        await this.syncDefaultAdminUser();
    }
    async syncDefaultAdminUser() {
        try {
            let adminRole = await this.roleModel.findOne({ where: { name: Role_model_1.RoleType.ADMIN } });
            if (!adminRole) {
                adminRole = await this.roleModel.create({
                    id: '11111111-1111-1111-1111-111111111111',
                    name: Role_model_1.RoleType.ADMIN,
                    description: 'Complete administrative, HR, payroll, and management access',
                });
                this.logger.log('Created default ADMIN role');
            }
            let empRole = await this.roleModel.findOne({ where: { name: Role_model_1.RoleType.EMPLOYEE } });
            if (!empRole) {
                await this.roleModel.create({
                    id: '22222222-2222-2222-2222-222222222222',
                    name: Role_model_1.RoleType.EMPLOYEE,
                    description: 'Self-service portal access',
                });
                this.logger.log('Created default EMPLOYEE role');
            }
            const defaultEmail = 'admin@hrms.com';
            const plainPassword = '123456';
            const passwordHash = await bcrypt.hash(plainPassword, 12);
            const companyId = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
            const existingUser = await this.userModel.findOne({ where: { email: defaultEmail } });
            if (existingUser) {
                await existingUser.update({
                    passwordHash,
                    roleId: adminRole.id,
                    isActive: true,
                });
                this.logger.log(`Synced default admin user (${defaultEmail}) with password '123456' and ADMIN role`);
            }
            else {
                await this.userModel.create({
                    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
                    companyId,
                    email: defaultEmail,
                    passwordHash,
                    roleId: adminRole.id,
                    isActive: true,
                });
                this.logger.log(`Created default admin user (${defaultEmail}) with password '123456' and ADMIN role`);
            }
        }
        catch (err) {
            this.logger.warn(`Default admin sync notice: ${err.message}`);
        }
    }
    async login(loginDto) {
        const user = await this.userModel.findOne({
            where: { email: loginDto.email },
            include: [
                { model: Role_model_1.Role },
                { model: Employee_model_1.Employee, attributes: ['id', 'firstName', 'lastName', 'employeeCode', 'photoUrl'] },
            ],
        });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Invalid email or password.');
        }
        const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid email or password.');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role?.name,
            companyId: user.companyId,
        };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_EXPIRES_IN') || '1h',
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d',
        });
        const tokenHash = await bcrypt.hash(refreshToken, 10);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.refreshTokenModel.create({
            userId: user.id,
            tokenHash,
            expiresAt,
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role?.name,
                companyId: user.companyId,
                employee: user.employee,
            },
            accessToken,
            refreshToken,
        };
    }
    async refreshTokens(refreshTokenStr) {
        try {
            const decoded = this.jwtService.verify(refreshTokenStr, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            const user = await this.userModel.findByPk(decoded.sub, {
                include: [{ model: Role_model_1.Role }],
            });
            if (!user || !user.isActive) {
                throw new common_1.UnauthorizedException('User account no longer active.');
            }
            const newPayload = {
                sub: user.id,
                email: user.email,
                role: user.role?.name,
                companyId: user.companyId,
            };
            const accessToken = this.jwtService.sign(newPayload, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_EXPIRES_IN') || '1h',
            });
            return { accessToken };
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token.');
        }
    }
    async logout(userId) {
        await this.refreshTokenModel.update({ isRevoked: true }, { where: { userId } });
        return { success: true, message: 'Logged out successfully.' };
    }
    async getCurrentUser(userId) {
        const user = await this.userModel.findByPk(userId, {
            attributes: ['id', 'email', 'isActive', 'createdAt'],
            include: [
                { model: Role_model_1.Role, attributes: ['id', 'name', 'description'] },
                { model: Employee_model_1.Employee },
            ],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found.');
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(User_model_1.User)),
    __param(1, (0, sequelize_1.InjectModel)(Role_model_1.Role)),
    __param(2, (0, sequelize_1.InjectModel)(RefreshToken_model_1.RefreshToken)),
    __metadata("design:paramtypes", [Object, Object, Object, jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map