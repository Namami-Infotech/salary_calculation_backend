import { OnModuleInit } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { SalaryStructure } from '../database/models/SalaryStructure.model';
import { SalaryComponent } from '../database/models/SalaryComponent.model';
import { EmployeeSalaryAssignment } from '../database/models/EmployeeSalaryAssignment.model';
import { PayrollBatch } from '../database/models/PayrollBatch.model';
import { Employee } from '../database/models/Employee.model';
import { LeaveRequest } from '../database/models/LeaveRequest.model';
export declare class SalaryService implements OnModuleInit {
    private structureModel;
    private componentModel;
    private assignmentModel;
    private batchModel;
    private employeeModel;
    private leaveRequestModel;
    private sequelize;
    constructor(structureModel: typeof SalaryStructure, componentModel: typeof SalaryComponent, assignmentModel: typeof EmployeeSalaryAssignment, batchModel: typeof PayrollBatch, employeeModel: typeof Employee, leaveRequestModel: typeof LeaveRequest, sequelize: Sequelize);
    onModuleInit(): Promise<void>;
    private ensureRecordsColumn;
    getStructures(companyId: string): Promise<SalaryStructure[]>;
    getBatches(companyId: string): Promise<PayrollBatch[]>;
    getBatchById(companyId: string, id: string): Promise<PayrollBatch>;
    createPayrollBatch(companyId: string, year: number, month: number, userId: string): Promise<PayrollBatch>;
    approveBatch(companyId: string, batchId: string, userId: string): Promise<PayrollBatch>;
    markBatchAsPaid(companyId: string, batchId: string, userId: string): Promise<PayrollBatch>;
    deleteBatch(companyId: string, batchId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
