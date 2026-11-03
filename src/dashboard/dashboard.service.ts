import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Employee, EmploymentStatus } from '../database/models/Employee.model';
import { LeaveRequest } from '../database/models/LeaveRequest.model';
import { PayrollBatch } from '../database/models/PayrollBatch.model';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const FULL_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Employee) private employeeModel: typeof Employee,
    @InjectModel(LeaveRequest) private leaveRequestModel: typeof LeaveRequest,
    @InjectModel(PayrollBatch) private batchModel: typeof PayrollBatch,
  ) {}

  async getStats(companyId?: string) {
    const empWhere: any = {};
    const batchWhere: any = {};
    if (companyId) {
      empWhere[Op.or] = [{ companyId }, { companyId: null }];
      batchWhere[Op.or] = [{ companyId }, { companyId: null }];
    }

    // 1. Fetch Employees
    const employees = await this.employeeModel.findAll({
      where: Object.keys(empWhere).length ? empWhere : undefined,
    });

    const totalEmployees = employees.length;
    let activeEmployees = 0;
    let inactiveEmployees = 0;
    let totalMonthlyLiability = 0;
    const departmentMap: Record<string, number> = {};

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    let newEmployeesThisMonth = 0;

    for (const emp of employees) {
      const isInactive = emp.employmentStatus === EmploymentStatus.INACTIVE || (emp.employmentStatus as string) === 'INACTIVE';
      if (isInactive) {
        inactiveEmployees++;
      } else {
        activeEmployees++;
      }

      if (emp.monthlySalary) {
        totalMonthlyLiability += Number(emp.monthlySalary) || 0;
      }

      if (emp.joiningDate) {
        const jDate = new Date(emp.joiningDate);
        if (jDate.getFullYear() === currentYear && jDate.getMonth() === currentMonth) {
          newEmployeesThisMonth++;
        }
      }

      const dept = emp.department && emp.department.trim() ? emp.department.trim() : 'General / Operations';
      departmentMap[dept] = (departmentMap[dept] || 0) + 1;
    }

    const deptColors = ['bg-indigo-600', 'bg-blue-600', 'bg-emerald-600', 'bg-amber-500', 'bg-purple-600', 'bg-rose-500'];
    let colorIdx = 0;
    const departmentBreakdown = Object.entries(departmentMap).map(([name, count]) => {
      const percentage = totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0;
      const color = deptColors[colorIdx % deptColors.length];
      colorIdx++;
      return { name, count, percentage, color };
    });

    departmentBreakdown.sort((a, b) => b.count - a.count);

    // 2. Fetch Leaves
    const leaves = await this.leaveRequestModel.findAll({
      include: [
        {
          model: Employee,
          as: 'employee',
          where: Object.keys(empWhere).length ? empWhere : undefined,
          required: false,
          attributes: ['id', 'firstName', 'lastName', 'employeeCode', 'email', 'department'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const totalLeaves = leaves.length;
    let pendingLeavesCount = 0;
    let approvedLeavesCount = 0;
    let rejectedLeavesCount = 0;

    for (const lv of leaves) {
      const statusUpper = (lv.status || '').toString().toUpperCase();
      if (statusUpper === 'PENDING' || statusUpper === 'SUBMITTED') {
        pendingLeavesCount++;
      } else if (statusUpper === 'APPROVED') {
        approvedLeavesCount++;
      } else if (statusUpper === 'REJECTED') {
        rejectedLeavesCount++;
      }
    }

    const recentLeaves = leaves.slice(0, 5).map((l) => ({
      id: l.id,
      employeeName: l.employee ? `${l.employee.firstName} ${l.employee.lastName}` : 'Employee',
      employeeCode: l.employee?.employeeCode || '',
      leaveType: l.leaveType,
      totalDays: l.totalDays,
      startDate: l.startDate,
      endDate: l.endDate,
      status: l.status,
      createdAt: l.createdAt,
    }));

    // 3. Fetch Payroll Batches
    const batches = await this.batchModel.findAll({
      where: Object.keys(batchWhere).length ? batchWhere : undefined,
      order: [['year', 'ASC'], ['month', 'ASC']],
    });

    const payrollChartData = batches.map((b) => {
      const mIdx = (b.month >= 1 && b.month <= 12) ? b.month - 1 : 0;
      const monthLabel = `${MONTH_NAMES[mIdx]} ${b.year}`;
      const amount = Number(b.totalGrossPay || b.totalNetPay || 0);
      const headcount = Array.isArray(b.records) ? b.records.length : (employees.length || 0);
      return {
        month: MONTH_NAMES[mIdx],
        fullMonth: monthLabel,
        year: b.year,
        monthNum: b.month,
        amount: Math.round(amount),
        employees: headcount,
        status: b.status,
      };
    });

    let avgPayroll = 0;
    let growthRate = 0;
    if (batches.length > 0) {
      const totalDisbursed = batches.reduce((acc, b) => acc + Number(b.totalGrossPay || 0), 0);
      avgPayroll = Math.round(totalDisbursed / batches.length);

      if (batches.length >= 2) {
        const last = Number(batches[batches.length - 1].totalGrossPay || 0);
        const prev = Number(batches[batches.length - 2].totalGrossPay || 0);
        if (prev > 0) {
          growthRate = Math.round(((last - prev) / prev) * 1000) / 10;
        }
      }
    }

    const descBatches = [...batches].reverse();
    const latestBatch = descBatches[0] || null;

    const recentBatches = descBatches.slice(0, 5).map((b) => {
      const mIdx = (b.month >= 1 && b.month <= 12) ? b.month - 1 : 0;
      const period = `${FULL_MONTH_NAMES[mIdx]} ${b.year}`;
      const headcount = Array.isArray(b.records) ? b.records.length : (employees.length || 0);
      const disbursed = Number(b.totalNetPay || b.totalGrossPay || 0);
      const dt = b.processedAt || b.approvedAt || (b as any).updatedAt || (b as any).createdAt;
      const dateFormatted = dt ? new Date(dt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Pending';

      return {
        id: b.id,
        period,
        disbursed,
        totalGross: Number(b.totalGrossPay || 0),
        totalDeductions: Number(b.totalDeductions || 0),
        headcount,
        status: b.status,
        date: dateFormatted,
      };
    });

    const activeCyclePeriod = latestBatch 
      ? `${FULL_MONTH_NAMES[(latestBatch.month - 1) % 12]} ${latestBatch.year} Cycle`
      : `${FULL_MONTH_NAMES[currentMonth]} ${currentYear} Cycle`;

    return {
      activeCyclePeriod,
      kpis: {
        totalHeadcount: totalEmployees,
        activeCount: activeEmployees,
        inactiveCount: inactiveEmployees,
        newThisMonth: newEmployeesThisMonth,
        totalMonthlyLiability,
        pendingLeaves: pendingLeavesCount,
        approvedLeaves: approvedLeavesCount,
        totalLeaves,
        processedPayrollAmount: latestBatch ? Number(latestBatch.totalGrossPay || latestBatch.totalNetPay || 0) : totalMonthlyLiability,
        latestBatchStatus: latestBatch ? latestBatch.status : 'NO_RUN',
        latestBatchPeriod: latestBatch ? `${FULL_MONTH_NAMES[(latestBatch.month - 1) % 12]} ${latestBatch.year}` : 'Not Generated',
      },
      payrollStats: {
        avgMonthlyExpenditure: avgPayroll,
        growthPercentage: growthRate,
        chartData: payrollChartData,
      },
      departmentBreakdown,
      recentBatches,
      recentLeaves,
    };
  }
}

