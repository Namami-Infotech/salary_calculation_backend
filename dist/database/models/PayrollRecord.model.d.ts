import { Model } from 'sequelize-typescript';
import { PayrollBatch } from './PayrollBatch.model';
import { Employee } from './Employee.model';
import { PayrollLineItem } from './PayrollLineItem.model';
import { Payslip } from './Payslip.model';
export declare enum PaymentStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    FAILED = "FAILED"
}
export declare class PayrollRecord extends Model {
    id: string;
    batchId: string;
    employeeId: string;
    totalDaysInMonth: number;
    paidDays: number;
    unpaidDays: number;
    basicSalary: number;
    grossEarnings: number;
    totalDeductions: number;
    netPay: number;
    paymentStatus: PaymentStatus;
    paymentMethod: string;
    transactionReference: string;
    paidAt: Date;
    batch: PayrollBatch;
    employee: Employee;
    lineItems: PayrollLineItem[];
    payslip: Payslip;
}
