import { Model } from 'sequelize-typescript';
import { Role } from './Role.model';
import { Employee } from './Employee.model';
import { RefreshToken } from './RefreshToken.model';
import { AuditLog } from './AuditLog.model';
export declare class User extends Model {
    id: string;
    companyId: string;
    email: string;
    passwordHash: string;
    roleId: string;
    isActive: boolean;
    role: Role;
    employee: Employee;
    refreshTokens: RefreshToken[];
    auditLogs: AuditLog[];
}
