import { Injectable, NotFoundException, ConflictException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { randomUUID } from 'crypto';
import { SalaryStructure } from '../database/models/SalaryStructure.model';
import { SalaryComponent, ComponentType } from '../database/models/SalaryComponent.model';
import { EmployeeSalaryAssignment } from '../database/models/EmployeeSalaryAssignment.model';
import { PayrollBatch, PayrollBatchStatus } from '../database/models/PayrollBatch.model';
import { Employee, EmploymentStatus } from '../database/models/Employee.model';
import { LeaveRequest, LeaveRequestStatus } from '../database/models/LeaveRequest.model';

@Injectable()
export class SalaryService implements OnModuleInit {
  constructor(
    @InjectModel(SalaryStructure) private structureModel: typeof SalaryStructure,
    @InjectModel(SalaryComponent) private componentModel: typeof SalaryComponent,
    @InjectModel(EmployeeSalaryAssignment) private assignmentModel: typeof EmployeeSalaryAssignment,
    @InjectModel(PayrollBatch) private batchModel: typeof PayrollBatch,
    @InjectModel(Employee) private employeeModel: typeof Employee,
    @InjectModel(LeaveRequest) private leaveRequestModel: typeof LeaveRequest,
    private sequelize: Sequelize,
  ) {}

  async onModuleInit() {
    await this.ensureRecordsColumn();
  }

  private async ensureRecordsColumn() {
    try {
      await this.sequelize.query(`ALTER TABLE payroll_batches ADD COLUMN records JSON NULL;`);
    } catch (e) {
      // Column already exists or already altered
    }
  }

  async getStructures(companyId: string) {
    const where: any = {};
    if (companyId) {
      where[Op.or] = [{ companyId }, { companyId: null }];
    }
    return this.structureModel.findAll({
      where: Object.keys(where).length ? where : undefined,
      include: [{ model: SalaryComponent }],
    });
  }

  async getBatches(companyId: string) {
    const where: any = {};
    if (companyId) {
      where[Op.or] = [{ companyId }, { companyId: null }];
    }
    return this.batchModel.findAll({
      where: Object.keys(where).length ? where : undefined,
      order: [['year', 'DESC'], ['month', 'DESC']],
    });
  }

  async getBatchById(companyId: string, id: string) {
    const where: any = { id };
    if (companyId) {
      where[Op.or] = [{ companyId }, { companyId: null }];
    }
    const batch = await this.batchModel.findOne({ where });

    if (!batch) {
      throw new NotFoundException(`Payroll batch with ID "${id}" not found.`);
    }

    return batch;
  }

  async createPayrollBatch(companyId: string, year: number, month: number, userId: string) {
    if (!year || !month || month < 1 || month > 12) {
      throw new BadRequestException('Please provide a valid year and month (1-12).');
    }

    // Ensure records JSON column exists in payroll_batches table
    await this.ensureRecordsColumn();

    // 1. Check for existing batch for period
    const existing = await this.batchModel.findOne({
      where: {
        ...(companyId ? { [Op.or]: [{ companyId }, { companyId: null }] } : {}),
        year,
        month,
      },
    });
    if (existing) {
      if (existing.status === PayrollBatchStatus.PREVIEW) {
        // Automatically delete the existing preview batch so it can be cleanly regenerated with updated rules
        await this.deleteBatch(companyId, existing.id);
      } else {
        throw new ConflictException(`Payroll batch for ${year}-${String(month).padStart(2, '0')} already exists (${existing.status}).`);
      }
    }

    // 2. Calculate calendar dates in month
    const totalDaysInMonth = new Date(year, month, 0).getDate();
    const monthStartStr = `${year}-${String(month).padStart(2, '0')}-01`;
    const monthEndStr = `${year}-${String(month).padStart(2, '0')}-${String(totalDaysInMonth).padStart(2, '0')}`;
    const monthStartDate = new Date(`${monthStartStr}T00:00:00Z`);
    const monthEndDate = new Date(`${monthEndStr}T23:59:59Z`);

    // 3. Fetch all active employees with overlapping leaves
    const empWhere: any = { employmentStatus: EmploymentStatus.ACTIVE };
    if (companyId) {
      empWhere[Op.or] = [{ companyId }, { companyId: null }];
    }

    const employees = await this.employeeModel.findAll({
      where: empWhere,
      include: [
        {
          model: EmployeeSalaryAssignment,
          as: 'salaryAssignments',
          where: { isActive: true },
          required: false,
        },
        {
          model: LeaveRequest,
          as: 'leaveRequests',
          required: false,
          where: {
            status: { [Op.in]: [LeaveRequestStatus.APPROVED, LeaveRequestStatus.PENDING] },
            startDate: { [Op.lte]: monthEndStr },
            endDate: { [Op.gte]: monthStartStr },
          },
        },
      ],
    });

    if (employees.length === 0) {
      throw new BadRequestException('No active employees found to generate payroll.');
    }

    const batchId = await this.sequelize.transaction(async (t) => {
      let batchGross = 0;
      let batchDeductions = 0;
      let batchNet = 0;
      const records: any[] = [];

      for (const emp of employees) {
        // Base gross salary from employee profile or assignment (default 45000 if not set)
        const assignment = emp.salaryAssignments?.[0];
        const monthlySalary = Number(emp.monthlySalary) > 0 
          ? Number(emp.monthlySalary) 
          : (assignment ? Number(assignment.grossSalary) : 45000);

        const perDaySalary = monthlySalary / totalDaysInMonth;

        // Calculate all leaves in this month (Casual Leave, Sick Leave, LWP, etc.)
        let totalLeaveDays = 0;
        const leaveBreakdown: { type: string; days: number; amount: number }[] = [];

        if (Array.isArray(emp.leaveRequests)) {
          for (const leave of emp.leaveRequests) {
            let days = Number(leave.totalDays);
            if (!days || isNaN(days) || days <= 0) {
              const leaveStart = new Date(leave.startDate) < monthStartDate ? monthStartDate : new Date(leave.startDate);
              const leaveEnd = new Date(leave.endDate) > monthEndDate ? monthEndDate : new Date(leave.endDate);
              days = Math.max(1, Math.ceil((leaveEnd.getTime() - leaveStart.getTime()) / (1000 * 60 * 60 * 24)) + 1);
              if (leave.isHalfDay) days = 0.5;
            }

            const leaveDedAmount = Math.round(days * perDaySalary * 100) / 100;
            totalLeaveDays += days;

            leaveBreakdown.push({
              type: leave.leaveType || 'Leave',
              days,
              amount: leaveDedAmount,
            });
          }
        }

        totalLeaveDays = Math.min(totalDaysInMonth, totalLeaveDays);
        const paidDays = Math.max(0, totalDaysInMonth - totalLeaveDays);

        // Leave deduction amount: calculated for all leaves taken
        const leaveDeduction = Math.round(totalLeaveDays * perDaySalary * 100) / 100;

        // Standard salary structure breakdown (Earnings)
        const basic = Math.round(monthlySalary * 0.50 * 100) / 100;
        const hra = Math.round(monthlySalary * 0.30 * 100) / 100;
        const specialAllowance = Math.round((monthlySalary - basic - hra) * 100) / 100;

        // Deductions
        const totalDed = leaveDeduction;
        const net = Math.max(0, Math.round((monthlySalary - totalDed) * 100) / 100);

        batchGross += monthlySalary;
        batchDeductions += totalDed;
        batchNet += net;

        // Line Items breakdown
        const lineItems = [
          { name: 'Basic Salary', type: ComponentType.EARNING, amount: basic },
          { name: 'House Rent Allowance (HRA)', type: ComponentType.EARNING, amount: hra },
          { name: 'Special Allowance', type: ComponentType.EARNING, amount: specialAllowance },
        ];

        if (leaveDeduction > 0) {
          if (leaveBreakdown.length > 0) {
            for (const item of leaveBreakdown) {
              lineItems.push({
                name: `Leave Deduction (${item.days} Day${item.days > 1 ? 's' : ''} - ${item.type})`,
                type: ComponentType.DEDUCTION,
                amount: item.amount,
              });
            }
          } else {
            lineItems.push({
              name: `Leave Deduction (${totalLeaveDays} Day${totalLeaveDays > 1 ? 's' : ''})`,
              type: ComponentType.DEDUCTION,
              amount: leaveDeduction,
            });
          }
        }

        const payslipNumber = `PAY-${year}${String(month).padStart(2, '0')}-${emp.employeeCode}`;

        records.push({
          id: randomUUID(),
          employeeId: emp.id,
          employee: {
            id: emp.id,
            firstName: emp.firstName,
            lastName: emp.lastName,
            employeeCode: emp.employeeCode,
            department: emp.department,
            designation: emp.designation,
            monthlySalary,
          },
          totalDaysInMonth,
          paidDays,
          unpaidDays: totalLeaveDays,
          basicSalary: basic,
          grossEarnings: monthlySalary,
          totalDeductions: totalDed,
          netPay: net,
          paymentStatus: 'PENDING',
          lineItems,
          payslip: {
            payslipNumber,
            generatedAt: new Date(),
          },
        });
      }

      const batch = await this.batchModel.create(
        {
          companyId,
          year,
          month,
          totalGrossPay: batchGross,
          totalDeductions: batchDeductions,
          totalNetPay: batchNet,
          status: PayrollBatchStatus.PREVIEW,
          processedBy: userId,
          processedAt: new Date(),
          records,
        },
        { transaction: t },
      );

      return batch.id;
    });

    return this.getBatchById(companyId, batchId);
  }

  async approveBatch(companyId: string, batchId: string, userId: string) {
    const where: any = { id: batchId };
    if (companyId) {
      where[Op.or] = [{ companyId }, { companyId: null }];
    }
    const batch = await this.batchModel.findOne({ where });
    if (!batch) throw new NotFoundException('Payroll batch not found.');

    await batch.update({
      status: PayrollBatchStatus.APPROVED,
      approvedBy: userId,
      approvedAt: new Date(),
    });

    return this.getBatchById(companyId, batchId);
  }

  async markBatchAsPaid(companyId: string, batchId: string, userId: string) {
    const where: any = { id: batchId };
    if (companyId) {
      where[Op.or] = [{ companyId }, { companyId: null }];
    }
    const batch = await this.batchModel.findOne({ where });
    if (!batch) throw new NotFoundException('Payroll batch not found.');

    const updatedRecords = Array.isArray(batch.records)
      ? batch.records.map((rec) => ({
          ...rec,
          paymentStatus: 'PAID',
          paidAt: new Date(),
        }))
      : batch.records;

    await batch.update({
      status: PayrollBatchStatus.PAID,
      processedBy: userId,
      processedAt: new Date(),
      records: updatedRecords,
    });

    return this.getBatchById(companyId, batchId);
  }

  async deleteBatch(companyId: string, batchId: string) {
    const where: any = { id: batchId };
    if (companyId) {
      where[Op.or] = [{ companyId }, { companyId: null }];
    }
    const batch = await this.batchModel.findOne({ where });
    if (!batch) throw new NotFoundException('Payroll batch not found.');
    if (batch.status === PayrollBatchStatus.PAID) {
      throw new BadRequestException('Cannot delete a payroll batch that is already marked as PAID.');
    }

    await batch.destroy();

    return { success: true, message: 'Payroll batch deleted successfully.' };
  }
}
