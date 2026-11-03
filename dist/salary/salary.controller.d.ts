import { SalaryService } from './salary.service';
import { AuthenticatedUser } from '../common/decorators/current-user.decorator';
export declare class SalaryController {
    private readonly salaryService;
    constructor(salaryService: SalaryService);
    getStructures(user: AuthenticatedUser): Promise<import("../database/models/SalaryStructure.model").SalaryStructure[]>;
    getBatches(user: AuthenticatedUser): Promise<import("../database/models/PayrollBatch.model").PayrollBatch[]>;
    createPayrollBatch(user: AuthenticatedUser, year: number, month: number): Promise<import("../database/models/PayrollBatch.model").PayrollBatch>;
    getBatchById(user: AuthenticatedUser, id: string): Promise<import("../database/models/PayrollBatch.model").PayrollBatch>;
    deleteBatch(user: AuthenticatedUser, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    approveBatch(user: AuthenticatedUser, id: string): Promise<import("../database/models/PayrollBatch.model").PayrollBatch>;
    markBatchAsPaid(user: AuthenticatedUser, id: string): Promise<import("../database/models/PayrollBatch.model").PayrollBatch>;
}
