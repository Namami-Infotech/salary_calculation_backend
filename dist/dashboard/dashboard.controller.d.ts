import { DashboardService } from './dashboard.service';
import { AuthenticatedUser } from '../common/decorators/current-user.decorator';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboardStats(user: AuthenticatedUser): Promise<{
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
