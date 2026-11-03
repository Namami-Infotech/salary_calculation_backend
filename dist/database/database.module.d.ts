import { OnModuleInit } from '@nestjs/common';
import { Role } from './models/Role.model';
import { User } from './models/User.model';
import { RefreshToken } from './models/RefreshToken.model';
import { Employee } from './models/Employee.model';
import { SalaryStructure } from './models/SalaryStructure.model';
import { SalaryComponent } from './models/SalaryComponent.model';
import { EmployeeSalaryAssignment } from './models/EmployeeSalaryAssignment.model';
import { PayrollBatch } from './models/PayrollBatch.model';
import { LeaveRequest } from './models/LeaveRequest.model';
import { AuditLog } from './models/AuditLog.model';
import { DatabaseSeederService } from './database-seeder.service';
export declare const ALL_MODELS: (typeof RefreshToken | typeof User | typeof Role | typeof Employee | typeof SalaryStructure | typeof SalaryComponent | typeof EmployeeSalaryAssignment | typeof PayrollBatch | typeof LeaveRequest | typeof AuditLog)[];
export declare class DatabaseModule implements OnModuleInit {
    private readonly seeder;
    constructor(seeder: DatabaseSeederService);
    onModuleInit(): Promise<void>;
}
