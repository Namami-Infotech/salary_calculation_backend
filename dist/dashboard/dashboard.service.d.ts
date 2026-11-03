import { Employee } from '../database/models/Employee.model';
import { LeaveRequest } from '../database/models/LeaveRequest.model';
import { PayrollBatch } from '../database/models/PayrollBatch.model';
export declare class DashboardService {
    private employeeModel;
    private leaveRequestModel;
    private batchModel;
    constructor(employeeModel: typeof Employee, leaveRequestModel: typeof LeaveRequest, batchModel: typeof PayrollBatch);
    getStats(companyId?: string): Promise<{
        activeCyclePeriod: string;
        kpis: {
            totalHeadcount: number;
            activeCount: number;
            inactiveCount: number;
            newThisMonth: number;
            totalMonthlyLiability: number;
            pendingLeaves: number;
            approvedLeaves: number;
            totalLeaves: number;
            processedPayrollAmount: number;
            latestBatchStatus: string;
            latestBatchPeriod: string;
        };
        payrollStats: {
            avgMonthlyExpenditure: number;
            growthPercentage: number;
            chartData: {
                month: string;
                fullMonth: string;
                year: number;
                monthNum: number;
                amount: number;
                employees: number;
                status: import("../database/models/PayrollBatch.model").PayrollBatchStatus;
            }[];
        };
        departmentBreakdown: {
            name: string;
            count: number;
            percentage: number;
            color: string;
        }[];
        recentBatches: {
            id: string;
            period: string;
            disbursed: number;
            totalGross: number;
            totalDeductions: number;
            headcount: number;
            status: import("../database/models/PayrollBatch.model").PayrollBatchStatus;
            date: string;
        }[];
        recentLeaves: {
            id: string;
            employeeName: string;
            employeeCode: string;
            leaveType: string;
            totalDays: number;
            startDate: string;
            endDate: string;
            status: import("../database/models/LeaveRequest.model").LeaveRequestStatus;
            createdAt: any;
        }[];
    }>;
}
