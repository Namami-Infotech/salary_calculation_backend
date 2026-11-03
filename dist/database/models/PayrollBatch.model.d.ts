import { Model } from 'sequelize-typescript';
export declare enum PayrollBatchStatus {
    DRAFT = "DRAFT",
    PREVIEW = "PREVIEW",
    APPROVED = "APPROVED",
    PROCESSED = "PROCESSED",
    PAID = "PAID"
}
export declare class PayrollBatch extends Model {
    id: string;
    companyId: string;
    year: number;
    month: number;
    totalGrossPay: number;
    totalDeductions: number;
    totalNetPay: number;
    status: PayrollBatchStatus;
    approvedBy: string;
    approvedAt: Date;
    processedBy: string;
    processedAt: Date;
    notes: string;
    records: any[];
}
